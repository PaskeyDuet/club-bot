import errorHandler from "#handlers/logErrorAndThrow.ts";
import smoothReplier from "#helpers/smoothReplier.ts";
import { MyContext } from "types/grammy.types";
import logger from "#root/logger.ts";
import guardExp from "#helpers/guardExp.ts";
import subscriptionHandler from "#db/handlers/subscriptionController.ts";
import usersController from "#db/handlers/usersController.ts";
import sendPayMessage from "./sendPayMessage";
import sendPaidMessage from "./sendPaidMessage";
import { greetingKeyboard } from "#keyboards/generalKeyboards.ts";

const createGreetingText = (firstName: string) => {
  let greeting = `Привет, ${firstName}. С возвращением `;
  greeting += "в меню бота клуба любителей английского языка.\n";
  greeting += "Чем я могу помочь?";
  return greeting;
};

export default async function sendStartMessage(ctx: MyContext) {
  ctx.session.routeHistory = [];
  ctx.session.conversation = {};
  ctx.session.temp.meetingNumber = null;

  const userId = ctx.userId || ctx.callbackQuery?.from.id;
  guardExp(userId, "noId");

  const user = await usersController.userVerification(userId);
  if (!user) {
    await ctx.conversation.enter("userReg");
    return;
  } else {
    try {
      const userSub = await subscriptionHandler.findSub(userId);
      guardExp(userSub, "userSub");
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
        const greeting = createGreetingText(user.first_name);
        const keyboard = greetingKeyboard(isNewbie, subStatus, false);
        return await smoothReplier(ctx, greeting, keyboard, "sendStartMessage");
      }
    } catch (err) {
      errorHandler(err, "fatal", "Error inside sendStartMessage");
    }
  }
}
