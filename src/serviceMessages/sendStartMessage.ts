import { greetingKeyboard } from "../keyboards/generalKeyboards";
import { MyContext } from "../types";

export default async function (ctx: MyContext) {
  ctx.session.routeHistory = [];

  let greeting = "Привет. Добро пожаловать ";
  greeting += "в меню бота клуба любителей английского языка.";
  greeting += " Чем я могу помочь?";

  let updatedCtx = await ctx.reply(greeting, {
    reply_markup: greetingKeyboard,
  });
  ctx.session.lastMsgId = updatedCtx.message_id;
}
