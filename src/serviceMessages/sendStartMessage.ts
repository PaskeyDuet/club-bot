import { Message, Update } from "grammy/types";
import userVerification from "../dbSetup/handlers/userVerification";
import { greetingKeyboard } from "../keyboards/generalKeyboards";
import { MyContext } from "../types/grammy.types";
import subscriptionHandler from "../dbSetup/handlers/subscriptionHandler";
import guardExp from "../helpers/guardExp";
import sendPayMessage from "./sendPayMessage";

export default async function sendStartMessage(ctx: MyContext) {
  ctx.session.routeHistory = [];
  ctx.session.conversation = {};
  ctx.session.temp.meetingNumber = null;
  const userId = ctx.msg?.chat?.id || ctx.callbackQuery?.from.id;
  guardExp(userId, "noId");
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
    const userSub = await subscriptionHandler.findSub(userId);
    guardExp(userSub, "found no subscription");
    const {
      dataValues: { sub_number, sub_status },
    } = userSub;

    const userSession = ctx.session.user;
    userSession.firstName = user.first_name;
    userSession.secondName = user.second_name;
    if (sub_number === 1 && sub_status === "active") {
      userSession.isNewbie = true;
    }
    const isNewbie = userSession.isNewbie;

    let subStatus: string | boolean;
    if (sub_status === "active") {
      subStatus = true;
    } else if (sub_status === "unactive") {
      subStatus = false;
    } else {
      subStatus = sub_status;
    }

    if (typeof subStatus === "string") {
      await sendPayMessage(ctx);
    } else {
      let greeting = `Привет, ${user.first_name}. С возвращением `;
      greeting += "в меню бота клуба любителей английского языка.\n";
      greeting += "Чем я могу помочь?";

      let updatedCtx:
        | Message.TextMessage
        | true
        | (Update.Edited &
            Message.CommonMessage & {
              text: string;
            });
      if (ctx.match) {
        updatedCtx = await ctx.editMessageText(greeting, {
          reply_markup: greetingKeyboard(isNewbie, subStatus),
        });
      } else {
        updatedCtx = await ctx.reply(greeting, {
          reply_markup: greetingKeyboard(isNewbie, subStatus),
        });
        ctx.session.lastMsgId = updatedCtx.message_id;
      }
    }
  }
}
