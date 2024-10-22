import { infoKeyboards } from "../keyboards/generalKeyboards";
import guardExp from "../helpers/guardExp";
import { photos } from "../media/mediaBuilders";
import { MyContext } from "../types/grammy.types";
import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";

export async function sendInfoMessage(ctx: MyContext) {
  let generalInfo = "Мы молодые амбициозные перспективные педагоги, ";
  generalInfo += "которые решили организовать клубклуб\n";
  generalInfo += "Ниже более подробная информация";

  try {
    ctx.editMessageText(generalInfo, {
      reply_markup: infoKeyboards.generalInfo,
    });
  } catch (error) {
    console.log("sendInfoMessage");
  }
}

export const infoUnits = (ctx: MyContext) => {
  guardExp(ctx.chatId, "info units err, who part");
  guardExp(ctx.msgId, "info units err, who part");
  // I don't know why but in where and when it is impossible to use ctx.msgId but msgId is ok
  const chatId = ctx.chatId;
  const msgId = ctx.msgId;
  return {
    who: async () => {
      let text =
        "Страница, на которой можно разместить изображения и добавить рассказ о том, почему наш клуб - клуб профессионалов";
      text +=
        "\nНо есть ограничение - фото можно вставить только одно. Видео ещё можно.";
      text += "Медиа сообщения пока недоступны. В разработке...";

      try {
        //FIXME: there is a trouble with trace routes and media messages
        // await ctx.api.deleteMessage(chatId, msgId);
        // await ctx.api.sendPhoto(chatId, photos.ourTeam, {
        //   caption: text,
        //   reply_markup: infoKeyboards.who,
        // });
        await ctx.api.editMessageText(chatId, msgId, text, {
          reply_markup: infoKeyboards.who,
        });
      } catch (err) {
        logErrorAndThrow(err, "fatal", "error inside who - infoUnits");
      }
    },
    where: async () => {
      let text: string =
        "Страница, на которой можно одновременно и ссылк на социальные сети, и локацию или район, где происходят встречи";

      try {
        await ctx.api.editMessageText(chatId, msgId, text, {
          reply_markup: infoKeyboards.where,
        });
      } catch (err) {
        logErrorAndThrow(err, "fatal", "error inside where - infoUnits");
      }
    },
    when: async () => {
      let text: string =
        "Страница, которая рассказывает о том, когда происходят встречи и как на них записаться";

      try {
        await ctx.api.editMessageText(chatId, msgId, text, {
          reply_markup: infoKeyboards.when,
        });
      } catch (err) {
        logErrorAndThrow(err, "fatal", "error inside when - infoUnits");
      }
    },
  };
};
