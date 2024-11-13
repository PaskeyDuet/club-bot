import meetingsController from "#db/handlers/meetingsController.js";
import {
  dates,
  createMeetingsList,
  prepareDbMeetingObj,
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
import dotenv from "dotenv";
import mammoth from "mammoth";
import type { MyContext, MyConversation } from "#types/grammy.types.js";
import conversationsPluginSupporter from "#helpers/conversationsPluginSupporter.js";
import { hydrateFiles } from "@grammyjs/files";
import sanitizedConfig from "#root/config.js";

dotenv.config();

export async function createMeetingConv(
  conversation: MyConversation,
  ctx: MyContext
) {
  try {
    const h = meetingHelpers;
    const filesPlugin = hydrateFiles(sanitizedConfig.BOT_API_TOKEN);
    await conversation.run(async (ctx, next) => {
      ctx.api.config.use(filesPlugin);
      await next();
    });

    const { meeting, vocabulary } = await getNProcessFile(conversation);
    const dbFormattedObj = prepareObjForDb(meeting);

    const meetingConfirmed = await meetingObjApproved(
      conversation,
      ctx,
      meeting
    );
    h.falseAnswerHandler(ctx, meetingConfirmed);

    await h.createMeeting(dbFormattedObj);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    // await h.displayResult(ctx, error.message);
  }
}

const getNProcessFile = async (
  conversation: MyConversation
): Promise<{ meeting: MeetingObject; vocabulary: string }> => {
  const h = getNProcessFileH;
  const filePath = await h.waitNGetFileNPath(conversation);
  const meetingStr = await h.getMeetingStr(conversation, filePath);

  return h.processDetails(meetingStr);
};
const getNProcessFileH = {
  waitNGetFileNPath: async (conversation: MyConversation) => {
    const msgObjWithDoc = await conversation.waitFor(":document");
    const fileDetails = await msgObjWithDoc.getFile();
    const filePath = await fileDetails.download();
    return filePath;
  },

  getMeetingStr: async (conversation: MyConversation, filePath: string) =>
    await conversation.external(() =>
      mammoth.extractRawText({ path: filePath }).then((res) => res.value)
    ),

  processDetails: (
    meetingStr: string
  ): { meeting: MeetingObject; vocabulary: string } => {
    const meetingBlocks = meetingStr.split("\n~\n");
    const date = meetingBlocks[0].replace("Date: ", "").trim();
    const topic = meetingBlocks[1].replace("Topic: ", "").trim();
    const place = meetingBlocks[2].replace("Place: ", "").trim();
    const vocabulary = meetingBlocks[3].replace(
      "Vocabulary you might find useful:\n",
      ""
    );
    return { meeting: { date, topic, place }, vocabulary };
  },
};

const prepareObjForDb = (meeting: MeetingObject): MeetingsCreationType => {
  const h = prepareObjForDbH;
  const dbFormattedObj = prepareDbMeetingObj(meeting);
  h.checkObjForEmptyValues(meeting);
  h.checkIfDateIsPassed(dbFormattedObj.date);
  return dbFormattedObj;
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

const meetingObjApproved = async (
  conversation: MyConversation,
  ctx: MyContext,
  meetingObj: MeetingObject
) => {
  const h = meetingObjApprovedH;
  const text = h.getMeetingText(meetingObj);
  await h.reply(ctx, text);
  const checkAnswer = await h.meetingObjAnswer(ctx, conversation);
  return h.checkAnswer(checkAnswer);
};
const meetingObjApprovedH = {
  getMeetingText: (meeting: MeetingObject) => {
    let text = "Подтвердите параметры встречи:\n\n";
    text += createMeetingsList.userView([meeting]);
    return text;
  },
  reply: async (ctx: MyContext, meetingCheckText: string) => {
    await ctx.reply(meetingCheckText, {
      reply_markup: meetingCreateCheckKeyboard,
    });
  },
  meetingObjAnswer: async (ctx: MyContext, conversation: MyConversation) => {
    const { match } =
      await conversation.waitForCallbackQuery(/meeting__obj_.+/);
    const answer = match[0].replace("meeting__obj_", "");
    return answer;
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

const meetingHelpers = {
  falseAnswerHandler: async (ctx: MyContext, answer: boolean) => {
    await sendAdminMenu(ctx);
    return;
  },

  async createMeeting(dbMeetingObj: MeetingsCreationType) {
    await meetingsController.createMeeting(dbMeetingObj);
  },

  async displayResult(ctx: MyContext, errorMessage?: string) {
    let messText = "";
    if (errorMessage) {
      messText =
        "Запись могла быть не создана. Проверьте существующие встречи.\n";
      messText += errorMessage;
    } else {
      // messText = createMeetingTexts().final
    }
    await ctx.reply(messText, {
      reply_markup: meetingCreatedMenu,
    });
  },
};
