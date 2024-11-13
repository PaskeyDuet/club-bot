import type { MyContext, MyConversation } from "#types/grammy.types.js";
import type { TextWithInlineKeyboardObj } from "#types/shared.types.js";
import unlessActions from "../unlessActions.js";

export default async function (
  conversation: MyConversation,
  ctx: MyContext,
  messageData: TextWithInlineKeyboardObj
) {
  return await conversation.waitUntil(
    async (ctx) => {
      if (ctx.callbackQuery) {
        const cbQ = ctx.callbackQuery;
        const meetingId = cbQ.data?.split("meeting__reg_")[1];
        if (meetingId) {
          conversation.session.temp.meetingNumber = +meetingId;
          return true;
        }
        return false;
      }
      return false;
    },
    {
      otherwise: (ctx) =>
        unlessActions(ctx, () => {
          // const otherwiseText =
          //   "<b><i>Пожалуйста, используйте кнопки для ответа</i></b>\n" +
          //   messageData.text;
          // ctx.reply(otherwiseText, {
          //   reply_markup: messageData.keyboard,
          //   parse_mode: "HTML",
          // });
        }),
    }
  );
}
