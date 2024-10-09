import { subKeyboard } from "../../keyboards/subKeyboards";
import { MyContext, MyConversation } from "../../types/grammy.types";

export async function subConv(conversation: MyConversation, ctx: MyContext) {
  const isNewbie = false;

  let subText = "Выберите тип подписки\n\n";
  subText += "<b>Месячная подписка</b> - 100р\n";
  subText += "<b>Трехмесячная подписка</b> - 1000р\n";
  subText += "<b>Годовая подписка</b> - 10000р\n";

  await ctx.editMessageText(subText, {
    reply_markup: subKeyboard(isNewbie),
    parse_mode: "HTML",
  });
  const subAnswer = await conversation.waitForCallbackQuery(/sub_/);
  console.log(subAnswer);
}
