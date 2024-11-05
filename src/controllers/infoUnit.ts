import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";
import { guardExp } from "#helpers/index.ts";
import { infoKeyboards } from "#keyboards/generalKeyboards.ts";
import { MyContext } from "#types/grammy.types.ts";
import { infoUnitPathsType } from "#types/shared.types.ts";

export async function sendInfoMessage(ctx: MyContext) {
  let text = infoTexts.infoMessage();
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
  guardExp(ctx.chatId, "chatId inside infoUnits");
  guardExp(ctx.msgId, "msgId inside infoUnits");

  const chatId = ctx.chatId;
  const msgId = ctx.msgId;
  let text = infoTexts[endpoint]();
  let keyboard = infoKeyboards[endpoint];

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
    logErrorAndThrow(err, "fatal", "error inside who - infoUnits");
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
