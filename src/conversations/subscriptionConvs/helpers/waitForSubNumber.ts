import { MyContext, MyConversation } from "../../../types/grammy.types";
import { TextWithInlineKeyboardObj } from "../../../types/shared.types";
import unlessActions from "../../helpers/unlessActions";

export default async function (
  ctx: MyContext,
  conversation: MyConversation,
  messageData: TextWithInlineKeyboardObj
) {
  return await conversation.waitUntil(
    async (ctx) => {
      if (ctx.callbackQuery) {
        const cbQ = ctx.callbackQuery;
        const meetingId = cbQ.data?.split("sub_")[1];
        if (meetingId) {
          let subNumber: number = 0; // sub number 1 is used for free sub
          switch (meetingId) {
            case "second":
              subNumber = 2;
              break;
            case "third":
              subNumber = 3;
              break;
            case "fourth":
              subNumber = 4;
              break;
          }

          conversation.session.temp.sub_number = subNumber;

          return true;
        }
        return false;
      } else {
        return false;
      }
    },
    {
      otherwise: (ctx) =>
        unlessActions(ctx, () => {
          const otherwiseText =
            "<b><i>Пожалуйста, используйте кнопки для ответа</i></b>\n" +
            messageData.text;
          ctx.reply(otherwiseText, {
            reply_markup: messageData.keyboard,
            parse_mode: "HTML",
          });
        }),
    }
  );
}
