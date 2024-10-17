import { Message, Update } from "grammy/types";
import { greetingKeyboard } from "../keyboards/generalKeyboards";
import { MyContext } from "../types/grammy.types";
import subscriptionHandler from "../dbSetup/handlers/subscriptionHandler";
import guardExp from "../helpers/guardExp";
import sendPayMessage from "./sendPayMessage";
import sendPaidMessage from "./sendPaidMessage";
import usersController from "../dbSetup/handlers/usersController";

export default async function sendStartMessage(ctx: MyContext) {
  ctx.session.routeHistory = [];
  ctx.session.conversation = {};
  ctx.session.temp.meetingNumber = null;
  const userId = ctx.userId || ctx.callbackQuery?.from.id;
  guardExp(userId, "noId");
  let user;
  if (userId) {
    user = await usersController.userVerification(userId);
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

    let subStatus: "pending" | "paid" | boolean;
    if (sub_status === "active") {
      subStatus = true;
    } else if (sub_status === "unactive") {
      subStatus = false;
    } else {
      subStatus = sub_status;
    }

    if (typeof subStatus === "string") {
      if (subStatus === "pending") {
        await sendPayMessage(ctx);
      } else {
        await sendPaidMessage(ctx);
      }
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
          reply_markup: greetingKeyboard(isNewbie, subStatus, false),
        });
      } else {
        updatedCtx = await ctx.reply(greeting, {
          reply_markup: greetingKeyboard(isNewbie, subStatus, false),
        });
        ctx.session.lastMsgId = updatedCtx.message_id;
      }
    }
  }
}
