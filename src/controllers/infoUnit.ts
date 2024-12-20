import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import { guardExp } from "#helpers/index.js";
import { infoKeyboards } from "#keyboards/generalKeyboards.js";
import type { MyContext } from "#types/grammy.types.js";
import type { infoUnitPathsType } from "#types/shared.types.js";

export async function sendInfoMessage(ctx: MyContext) {
  const text = infoTexts.infoMessage();
  try {
    ctx.editMessageText(text, {
      reply_markup: infoKeyboards.generalInfo,
    });
  } catch (error) {
    console.log("sendInfoMessage");
  }
}

export const infoUnits = async (
  ctx: MyContext,
  endpoint: infoUnitPathsType
) => {
  guardExp(ctx.chatId, "chatId inside infoUn.js");
  guardExp(ctx.msgId, "msgId inside infoUn.js");

  const chatId = ctx.chatId;
  const msgId = ctx.msgId;
  const text = infoTexts[endpoint]();
  const keyboard = infoKeyboards[endpoint];

  try {
    //FIXME: there is a trouble with trace routes and media messages
    // await ctx.api.deleteMessage(chatId, msgId);
    // await ctx.api.sendPhoto(chatId, photos.ourTeam, {
    //   caption: text,
    //   reply_markup: infoKeyboards.who,
    // });
    await ctx.api.editMessageText(chatId, msgId, text, {
      reply_markup: keyboard,
    });
  } catch (err) {
    logErrorAndThrow(err, "fatal", "error inside who - infoUn.js");
  }
};

const infoTexts = {
  infoMessage: () => {
    let text = "Мы молодые амбициозные перспективные педагоги, ";
    text += "которые решили организовать клубклуб\n";
    text += "Ниже более подробная информация";
    return text;
  },
  who: () => {
    let text = "Страница, на которой можно разместить изображения и ";
    text += "добавить рассказ о том, почему наш клуб - клуб профессионалов";
    text += "\nНо есть ограничение - фото можно ";
    text += "вставить только одно. Видео ещё можно.";
    text += "Медиа сообщения пока недоступны. В разработке...";
    return text;
  },
  where: () => {
    let text = "Страница, на которой можно одновременно и ссылки";
    text += " на социальные сети, и локацию или район, где происходят встречи";
    return text;
  },
  when: () => {
    let text = "Страница, которая рассказывает о том, ";
    text += "когда происходят встречи и как на них записаться";
    return text;
  },
};
