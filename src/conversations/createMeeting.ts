import meetingsController from "#db/handlers/meetingsController.js";
import {
  dates,
  createMeetingsList,
  prepareDbMeetingObj,
  createVocabularyList,
  checkMessageLength,
  guardExp,
} from "#helpers/index.js";
import {
  adminMenu,
  meetingCreateCheckKeyboard,
  meetingCreatedMenu,
} from "#keyboards/index.js";
import logger from "#root/logger.js";
import sendAdminMenu from "#serviceMessages/sendAdminMenu.js";
import type { MeetingObject } from "#types/shared.types.js";
import type { MeetingsCreationType } from "#db/models/Meetings.js";
import mammoth from "mammoth";
import type { MyContext, MyConversation } from "#types/grammy.types.js";
import { hydrateFiles } from "@grammyjs/files";
import sanitizedConfig from "#root/config.js";
import type {
  MeetingsVocabularyCreationT,
  RawVocabularyWithTagNameT,
} from "#db/models/MeetingsVocabulary.js";
import type { InlineKeyboard } from "grammy";
import unlessActions from "./helpers/unlessActions.js";
import { sequelize } from "#db/dbClient.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import type { Transaction } from "sequelize";
import type Meetings from "#db/models/Meetings.js";
import vocabularyTagController from "#db/handlers/vocabularyTagController.js";
import VocabularyTags, { VocabularyTagsT } from "#db/models/VocabularyTags.js";
import meetingsVocabularyController from "#db/handlers/meetingsVocabularyController.js";
import MeetingsVocabulary from "#db/models/MeetingsVocabulary.js";
type tagMapT = { [key: string]: number };
export async function createMeetingConv(
  conversation: MyConversation,
  ctx: MyContext
) {
  try {
    const filesPlugin = hydrateFiles(sanitizedConfig.BOT_API_TOKEN);
    await conversation.run(async (ctx, next) => {
      ctx.api.config.use(filesPlugin);
      await next();
    });
    const { texts } = meetingHelpers;

    await ctx.editMessageText(
      "Пожалуйста, отправьте документ с информацией о встрече",
      {
        reply_markup: adminMenu,
      }
    );

    const { meeting, vocabulary } = await getNProcessFile(conversation);

    const meetingConfirmed = await checkData(
      ctx,
      conversation,
      texts.meeting(meeting),
      meetingCreateCheckKeyboard
    );
    if (!meetingConfirmed) {
      await sendAdminMenu(ctx);
      return;
    }
    const vocabularyConfirmed = await checkData(
      ctx,
      conversation,
      texts.vocabulary(vocabulary),
      meetingCreateCheckKeyboard
    );

    if (!vocabularyConfirmed) {
      await sendAdminMenu(ctx);
      return;
    }

    await dbProcessing(meeting, vocabulary);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    // await h.displayResult(ctx, error.message);
  }
}

const getNProcessFile = async (
  conversation: MyConversation
): Promise<{
  meeting: MeetingObject;
  vocabulary: RawVocabularyWithTagNameT[];
}> => {
  const h = getNProcessFileH;
  const filePath = await h.waitNGetFileNPath(conversation);
  const meetingStr = await h.getMeetingStr(conversation, filePath);
  const processedObj = h.processDetails(meetingStr);
  return processedObj;
};
const getNProcessFileH = {
  waitNGetFileNPath: async function (conversation: MyConversation) {
    const msgObjWithDoc = await this.waitFile(conversation);
    const fileDetails = await msgObjWithDoc.getFile();
    const filePath = await fileDetails.download();
    return filePath;
  },
  waitFile: async (conversation: MyConversation) => {
    return await conversation.waitFor(":document", {
      otherwise: (ctx) =>
        unlessActions(
          ctx,
          async () =>
            await ctx.reply("В ответе должен содержаться документ", {
              reply_markup: adminMenu,
            })
        ),
    });
  },
  getMeetingStr: async (conversation: MyConversation, filePath: string) =>
    await conversation.external(() =>
      mammoth.extractRawText({ path: filePath }).then((res) => res.value)
    ),
  processDetails: function (meetingStr: string): {
    meeting: MeetingObject;
    vocabulary: RawVocabularyWithTagNameT[];
  } {
    const meetingBlocks = meetingStr.split("\n~\n");
    const date = meetingBlocks[0].replace("Date: ", "").trim();
    const topic = meetingBlocks[1].replace("Topic: ", "").trim();
    const place = meetingBlocks[2].replace("Place: ", "").trim();
    const rawVocabulary = meetingBlocks[3].replace(
      "Vocabulary you might find useful:\n",
      ""
    );
    const vocabulary = this.processVocabulary(rawVocabulary);
    return { meeting: { date, topic, place }, vocabulary };
  },
  processVocabulary: function (vocab: string): RawVocabularyWithTagNameT[] {
    const units = vocab.split(";");
    const objs: RawVocabularyWithTagNameT[] = units
      .map(this.splitVocabularyUnits)
      .filter((el) => el !== null);

    return objs;
  },
  splitVocabularyUnits: (unit: string) => {
    const unitParts = unit.split("\n").filter(Boolean);
    if (unitParts.length === 0) return null;
    const [lexical_unit, translation] = unitParts[0].split(" = ");
    const tag_name = unitParts[1];
    const [example, example_translation] = unitParts[2].split(" = ");

    return {
      lexical_unit,
      translation,
      tag_name,
      example,
      example_translation,
    };
  },
};

const prepareObjForDbH = {
  checkObjForEmptyValues: (obj: MeetingObject) => {
    const keys = Object.keys(obj);
    keys.map((el) => {
      if (el === "")
        throw new Error(
          "Одно из значений пустое. Попробуйте создать встречу заново"
        );
    });
  },

  checkIfDateIsPassed: (date: Date) => {
    const dateIsPassed = dates.isDatePassed(date);
    if (dateIsPassed) throw new Error("Вы указали прошедшую дату");
  },
};

const checkData = async (
  ctx: MyContext,
  conversation: MyConversation,
  text: string,
  keyboard: InlineKeyboard
) => {
  const completeText = `${text}\n\nПодтвердите верность считанных данных`;
  const lenCheckedText = checkMessageLength(completeText);
  const reply = await ctx.reply(lenCheckedText, {
    reply_markup: keyboard,
    parse_mode: "HTML",
  });
  const checkAnswer = await meetingHelpers.answerHandler(conversation);
  await ctx.api.deleteMessage(reply.chat.id, reply.message_id);

  return meetingHelpers.checkAnswer(checkAnswer);
};

const meetingHelpers = {
  falseAnswerHandler: async (ctx: MyContext, answer: boolean) => {
    await sendAdminMenu(ctx);
    return;
  },

  answerHandler: async (conversation: MyConversation) => {
    const { match } =
      await conversation.waitForCallbackQuery(/meeting__obj_.+/);
    const answer = match[0].replace("meeting__obj_", "");
    return answer;
  },

  texts: {
    vocabulary: (vocabObj: RawVocabularyWithTagNameT[]) =>
      createVocabularyList.basicView(vocabObj),
    meeting: (meeting: MeetingObject) => createMeetingsList.userView([meeting]),
  },

  checkAnswer: (answer: string): boolean => {
    switch (answer) {
      case "submit":
        return true;
      case "reject":
        return false;
      default:
        throw new Error("no processing answer");
    }
  },
};

const dbProcessing = async (
  meeting: MeetingObject,
  vocab: RawVocabularyWithTagNameT[]
) => {
  const h = dbProcessingH;
  const transaction = await sequelize.transaction();
  try {
    const meetingDbObj = await h.createMeeting(meeting, transaction);
    const tagsMap = await h.processAndCollectTagIds(vocab, transaction);
    await h.writeVocabUnitsToDb(
      vocab,
      meetingDbObj.meeting_id,
      tagsMap,
      transaction
    );
    console.log(await VocabularyTags.findAll());
    console.log(await MeetingsVocabulary.findAll());
  } catch (err) {
    await transaction.rollback();
    console.log(await VocabularyTags.findAll());
    logErrorAndThrow(err as Error, "error", "error creating meeting");
  }
};
const dbProcessingH = {
  prepareObjForDb(meeting: MeetingObject): MeetingsCreationType {
    const h = prepareObjForDbH;
    const dbFormattedObj = prepareDbMeetingObj(meeting);
    h.checkObjForEmptyValues(meeting);
    h.checkIfDateIsPassed(dbFormattedObj.date);
    return dbFormattedObj;
  },
  async createMeeting(
    meeting: MeetingObject,
    transaction: Transaction
  ): Promise<Meetings> {
    const dbPreparedMeeting = this.prepareObjForDb(meeting);
    const meetingDbObj = await meetingsController.createMeeting(
      dbPreparedMeeting,
      transaction
    );
    guardExp(meetingDbObj, "meetingObj inside dbProcessing");
    return meetingDbObj;
  },
  async writeVocabUnitsToDb(
    vocabObjs: RawVocabularyWithTagNameT[],
    meeting_id: number,
    tagsMap: tagMapT,
    transaction: Transaction
  ) {
    const formedVocabs = vocabObjs.map((obj) =>
      this.createVocabularyUnit(obj, tagsMap, meeting_id)
    );

    return await meetingsVocabularyController.createVocabularyUnits(
      formedVocabs,
      transaction
    );
  },
  createVocabularyUnit(
    vocabUnit: RawVocabularyWithTagNameT,
    tagsMap: tagMapT,
    meeting_id: number
  ): MeetingsVocabularyCreationT {
    const tag_id = tagsMap[vocabUnit.tag_name];
    const { lexical_unit, translation, example, example_translation } =
      vocabUnit;

    return {
      lexical_unit,
      translation,
      example,
      example_translation,
      tag_id,
      meeting_id,
    };
  },

  async processAndCollectTagIds(
    vocab: RawVocabularyWithTagNameT[],
    transaction: Transaction
  ) {
    const uniqueSet = [...new Set(vocab.map((unit) => unit.tag_name))];
    const tagObjects = await this.createTags(uniqueSet, transaction);
    return tagObjects.reduce((acc: tagMapT, el) => {
      acc[el.tag_name] = el.id;
      return acc;
    }, {});
  },
  createTags(tagsArr: string[], transaction: Transaction) {
    const formedTags = tagsArr.map((tag) => {
      return { tag_name: tag };
    });
    return vocabularyTagController.createTags(formedTags, transaction);
  },
};
