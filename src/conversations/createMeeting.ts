import meetingsController from "#db/handlers/meetingsController.js";
import {
  dates,
  guardExp,
  createMeetingsList,
  prepareDbMeetingObj,
  smoothReplier,
} from "#helpers/index.js";
import {
  adminMenu,
  meetingCreateCheckKeyboard,
  meetingCreatedMenu,
} from "#keyboards/index.js";
import logger from "#root/logger.js";
import sendAdminMenu from "#serviceMessages/sendAdminMenu.js";
import type { MeetingObject } from "#types/shared.types.js";
import type { MyContext, MyConversation } from "#types/grammy.types.js";
import type { MeetingsCreationType } from "#db/models/Meetings.js";
import dotenv from "dotenv";
import https from "node:https";
import fs from "node:fs";

dotenv.config();

export async function createMeetingConv(
  conversation: MyConversation,
  ctx: MyContext
) {
  const fileData = await conversation.waitFor(":document");
  const file = await fileData.getFile();
  const path = await file.download();
  console.log(path);

  // const h = createMeetingHelpers;
  // try {
  //   const meetingDetails = await h.gatherMeetingDetails(conversation, ctx);
  //   const dbMeetingObj = prepareDbMeetingObj(meetingDetails);

  //   if (dates.isDatePassed(dbMeetingObj.date)) {
  //     await h.handlePastMeetingDate(ctx);
  //     return;
  //   }

  //   const userConfirmed = await h.processUserAnswer(
  //     conversation,
  //     ctx,
  //     meetingDetails
  //   );

  //   if (!userConfirmed) {
  //     await sendAdminMenu(ctx);
  //     return;
  //   }

  //   await h.createMeeting(dbMeetingObj);
  //   await h.displayResult(ctx, false);
  // } catch (err) {
  //   const error = err as Error;
  //   logger.error(error.message);
  //   await h.displayResult(ctx, true);
  // }
}

const createMeetingHelpers = {
  documentFetcher: (filePath: string) =>
    new Promise((resolve, reject) => {
      const token = process.env.BOT_API_TOKEN;
      const url = `https://api.telegram.org/file/bot${token}/${filePath}`;

      https
        .get(url, (res) => {
          if (res.statusCode !== 200) {
            const { statusCode, statusMessage } = res;
            reject(new Error(`Status code: ${statusCode} ${statusMessage}`));
          }

          const data: Uint8Array[] = [];

          // Слушаем событие 'data' для получения данных
          res.on("data", (chunk) => {
            data.push(chunk); // Сохраняем двоичные данные
          });

          // Слушаем событие 'end' для завершения получения данных
          res.on("end", () => {
            // Объединяем все буферы в один
            const buffer = Buffer.concat(data);

            // Преобразуем буфер в строку UTF-8
            const utf8String = buffer.toString("utf-8");

            resolve(utf8String); // Возвращаем строку
          });
        })
        .on("error", (err) => {
          reject(err); // Обрабатываем ошибки запроса
        });
    }),
  async gatherMeetingDetails(
    conversation: MyConversation,
    ctx: MyContext
  ): Promise<MeetingObject> {
    const texts = createMeetingtexts();
    const questions = texts.questions();

    const details = [];
    for await (const detail of generateMeetingsQs(
      conversation,
      ctx,
      questions
    )) {
      guardExp(detail, "detail inside createMeetingConv");
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
    const texts = createMeetingtexts();
    const meetingCheckText = texts.meeting(meetingDetails);

    await ctx.reply(meetingCheckText, {
      reply_markup: meetingCreateCheckKeyboard,
    });

    const checkAnswer = await articleProcessing(ctx, conversation);

    if (checkAnswer === "submit") {
      return true;
    }
    if (checkAnswer === "reject") {
      return false;
    }

    throw new Error("no processing answer");
  },

  async createMeeting(dbMeetingObj: MeetingsCreationType) {
    await meetingsController.createMeeting(dbMeetingObj);
  },

  async displayResult(ctx: MyContext, errorFound: boolean) {
    let messText: string;
    if (errorFound) {
      messText = "Запись могла быть не создана. Проверьте существующие встречи";
    } else {
      messText = createMeetingtexts().final();
    }
    await ctx.reply(messText, {
      reply_markup: meetingCreatedMenu,
    });
  },
};

const createMeetingtexts = () => ({
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
