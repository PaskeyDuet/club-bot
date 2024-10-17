import { greetingKeyboard } from "../keyboards/generalKeyboards";
import { MyContext } from "../types/grammy.types";

export default async (ctx: MyContext) => {
  let paidText = "Ваш платёж находится в обработке";

  const updatedCtx = await ctx.reply(paidText, {
    reply_markup: greetingKeyboard(false, false, true),
  });
  ctx.session.lastMsgId = updatedCtx.message_id;
};
