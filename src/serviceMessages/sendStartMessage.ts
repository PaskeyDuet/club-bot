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
    const userSession = ctx.session.user;
    userSession.firstName = user.first_name;
    userSession.secondName = user.second_name;
    userSession.isNewbie = user.is_newbie;

    let greeting = `Привет, ${user.first_name}. С возвращением`;
    greeting += "в меню бота клуба любителей английского языка.\n";
    greeting += "Чем я могу помочь?";

    let updatedCtx = await ctx.reply(greeting, {
      reply_markup: greetingKeyboard,
    });
    ctx.session.lastMsgId = updatedCtx.message_id;
  }
}
