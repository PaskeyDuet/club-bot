import { infoKeyboards } from "../keyboards/generalKeyboards";
import guardExp from "../helpers/guardExp";
import { photos } from "../media/mediaBuilders";
import { MyContext } from "../types/grammy.types";

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
  return {
    who: () => {
      guardExp(ctx.chatId, "info units err, who part");
      guardExp(ctx.msgId, "info units err, who part");
      let text: string =
        "Страница, на которой можно разместить изображения и добавить рассказ о том, почему наш клуб - клуб профессионалов";
      text +=
        "\nНо есть ограничение - фото можно вставить только одно. Видео ещё можно";

      ctx.api.sendPhoto(ctx.chatId, photos.ourTeam, {
        caption: text,
        reply_markup: infoKeyboards.who,
      });

      ctx.session.editMode = false;
    },
    where: () => {
      guardExp(ctx.chatId, "info units err, where part");
      guardExp(ctx.msgId, "info units err, where part");
      let text: string =
        "Страница, на которой можно одновременно и ссылк на социальные сети, и локацию или район, где происходят встречи";

      ctx.api.editMessageText(ctx.chatId, ctx.msgId, text, {
        reply_markup: infoKeyboards.who,
      });
    },
    when: () => {
      guardExp(ctx.chatId, "info units err, when part");
      guardExp(ctx.msgId, "info units err, when part");
      let text: string =
        "Страница, которая рассказывает о том, когда происходят встречи и как на них записаться";

      ctx.api.editMessageText(ctx.chatId, ctx.msgId, text, {
        reply_markup: infoKeyboards.who,
      });
    },
  };
};
