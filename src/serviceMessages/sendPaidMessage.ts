import { greetingKeyboard } from "../keyboards/generalKeyboards";
import { MyContext } from "../types/grammy.types";

export default async (ctx: MyContext) => {
  let paidText = "Ваш платёж находится в обработке";

  await ctx.reply(paidText, {
    reply_markup: greetingKeyboard(false, false, true),
  });
};
