import { MyContext, MyConversation } from "../../types/grammy.types";
import { TextWithInlineKeyboardObj } from "../../types/shared.types";
import unlessActions from "./unlessActions";

export default async function (
  conversation: MyConversation,
  ctx: MyContext,
  messageData: TextWithInlineKeyboardObj
) {
  return await conversation.waitForCallbackQuery(/reg_for_meeting/, {
    otherwise: (ctx) =>
      //FIXME
      unlessActions(ctx, () => {
        const otherwiseText =
          "<b><i>Пожалуйста, используйте кнопки для ответа</i></b>\n" +
          messageData.text;
        ctx.reply(otherwiseText, {
          reply_markup: messageData.keyboard,
          parse_mode: "HTML",
        });
      }),
  });
}
