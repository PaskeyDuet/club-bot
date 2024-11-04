import meetingsController from "#db/handlers/meetingsController.ts";
import dates from "#helpers/dates.ts";
import guardExp from "#helpers/guardExp.ts";
import {
  createMeetingsList,
  getFutureMeetings,
  prepareDbMeetingObj,
} from "#helpers/meetingsHelpers.ts";
import smoothReplier from "#helpers/smoothReplier.ts";
import { adminMenu } from "#keyboards/generalKeyboards.ts";
import {
  meetingCreateCheckKeyboard,
  meetingCreatedMenu,
} from "#keyboards/meetingsKeyboards.ts";
import logger from "#root/logger.ts";
import sendAdminMenu from "#serviceMessages/sendAdminMenu.ts";
import { MyContext, MyConversation } from "#types/grammy.types.ts";
import { MeetingObject, MeetingObjectWithId } from "#types/shared.types.ts";

export async function createMeetingConv(
  conversation: MyConversation,
  ctx: MyContext
) {
  const h = createMeetingHelpers;
  try {
    const meetingDetails = await h.gatherMeetingDetails(conversation, ctx);
    const dbMeetingObj = prepareDbMeetingObj(meetingDetails);

    if (dates.isDatePassed(dbMeetingObj.date)) {
      await h.handlePastMeetingDate(ctx);
      return;
    }

    const userConfirmed = await h.processUserAnswer(
      conversation,
      ctx,
      meetingDetails
    );

    if (!userConfirmed) {
      await sendAdminMenu(ctx);
      return;
    }

    await h.createMeeting(dbMeetingObj);
    await h.displayResult(ctx, false);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    await h.displayResult(ctx, true);
  }
}

const createMeetingHelpers = {
  async gatherMeetingDetails(
    conversation: MyConversation,
    ctx: MyContext
  ): Promise<MeetingObject> {
    const texts = createMeetingTexts();
    const questions = texts.questions();

    const details = [];
    for await (const detail of generateMeetingsQs(
      conversation,
      ctx,
      questions
    )) {
      guardExp(detail, `detail inside createMeetingConv`);
      details.push(detail);
    }

    return {
      place: details[2],
      topic: details[1],
      date: details[0],
    };
  },

  async handlePastMeetingDate(ctx: MyContext) {
    await ctx.reply("Вы указали прошедшую дату. Встреча не была создана", {
      reply_markup: adminMenu,
    });
  },

  async processUserAnswer(
    conversation: MyConversation,
    ctx: MyContext,
    meetingDetails: MeetingObject
  ): Promise<boolean> {
    const texts = createMeetingTexts();
    const meetingCheckText = texts.meeting(meetingDetails);

    await ctx.reply(meetingCheckText, {
      reply_markup: meetingCreateCheckKeyboard,
    });

    const checkAnswer = await articleProcessing(ctx, conversation);

    if (checkAnswer === "submit") {
      return true;
    } else if (checkAnswer === "reject") {
      return false;
    }

    throw new Error("no processing answer");
  },

  async createMeeting(dbMeetingObj: any) {
    await meetingsController.createMeeting(dbMeetingObj);
  },

  async displayResult(ctx: MyContext, errorFound: boolean) {
    let messText: string;
    if (errorFound) {
      messText = "Запись могла быть не создана. Проверьте существующие встречи";
    } else {
      messText = createMeetingTexts().final();
    }
    await ctx.reply(messText, {
      reply_markup: meetingCreatedMenu,
    });
  },
};

const createMeetingTexts = () => ({
  date: "Напишите дату в формате <i><b>24.10.24, 10:30</b></i>",
  topic: "Напишите тему занятия",
  place: "Напишите место, где пройдет встреча",
  questions() {
    return [this.date, this.topic, this.place];
  },
  meeting(meetingObject: MeetingObject) {
    let text = "Подтвердите параметры встречи:\n\n";
    text += createMeetingsList.userView([meetingObject]);
    return text;
  },
  final() {
    return "Встреча зарегистрирована";
  },
});

const generateMeetingsQs = async function* (
  conversation: MyConversation,
  ctx: MyContext,
  texts: string[]
) {
  try {
    const zeroText = texts.shift() as string;
    await smoothReplier(ctx, zeroText, undefined, "generateMeetingsQs");
    const { message } = await conversation.waitFor(":text");
    const date = message?.text;
    yield date?.trim();

    for (const t of texts) {
      await ctx.reply(t);
      const messageObj = await conversation.waitFor(":text");
      const messageText = messageObj.message?.text;

      if (messageText) {
        yield messageText;
      } else {
        throw new Error("empty message inside generateMeetingsQs generator");
      }
    }
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    await ctx.reply(
      "Произошла ошибка во время создания встречи. Зайдите позже"
    );
    return;
  }
};

async function articleProcessing(ctx: MyContext, conversation: MyConversation) {
  const { match } =
    await conversation.waitForCallbackQuery(/meeting__create_.+/);
  const answer = match[0].replace("meeting__create_", "");
  return answer;
}
