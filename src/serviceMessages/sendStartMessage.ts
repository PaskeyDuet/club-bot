import userVerification from "../dbSetup/handlers/userVerification";
import { greetingKeyboard } from "../keyboards/generalKeyboards";
import { MyContext } from "../types/grammy.types";

export default async function sendStartMessage(ctx: MyContext) {
  ctx.session.routeHistory = [];
  const userId = ctx.msg?.from?.id;
  let user;
  if (userId) {
    user = await userVerification(userId);
  }

  if (!user) {
    // TODO: Добавить отлов ошибок: в случае невозможности
    // зарегистрироваться создать ошибку (отлов поставить в внутрь юззер рега)
    await ctx.conversation.enter("userReg");
    return;
  } else {
    const firstName = user.first_name;
    let greeting = `Привет, ${firstName}. С возвращением`;
    greeting += "в меню бота клуба любителей английского языка.\n";
    greeting += "Чем я могу помочь?";

    let updatedCtx = await ctx.reply(greeting, {
      reply_markup: greetingKeyboard,
    });
    ctx.session.lastMsgId = updatedCtx.message_id;
  }
}
