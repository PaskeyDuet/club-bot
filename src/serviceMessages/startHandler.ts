import errorHandler from "#handlers/logErrorAndThrow.ts";
import smoothReplier from "#helpers/smoothReplier.ts";
import { MyContext } from "types/grammy.types";
import guardExp from "#helpers/guardExp.ts";
import { subscriptionController } from "#db/handlers/index.ts";
import { usersController } from "#db/handlers/index.ts";
import sendPayMessage from "./sendPayMessage";
import sendPaidMessage from "./sendPaidMessage";
import { greetingKeyboard } from "#keyboards/generalKeyboards.ts";
import { SubStatusNames } from "#types/shared.types.ts";
import User from "#db/models/User.ts";
import UserSubscription from "#db/models/UserSubscription.ts";
import { validateSub } from "#helpers/subHelpers.ts";

export default async function startHandler(ctx: MyContext) {
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
    return await sendStartMessage(ctx, user, userId);
  }
}

async function sendStartMessage(ctx: MyContext, user: User, userId: number) {
  try {
    const h = sendStartMessageHelpers;

    const userSub = await validateSub(userId);
    const { userSession, sub_status } = h.ctxFiller(ctx, user, userSub);
    const isNewbie = userSession.isNewbie;
    const subStatus = h.subStatusGetter(sub_status);

    if (typeof subStatus === "string") {
      await h.sendPayMessages(ctx, subStatus);
    } else {
      const greeting = h.createGreetingText(user.first_name);
      const keyboard = greetingKeyboard(isNewbie, subStatus, false);
      return await smoothReplier(ctx, greeting, keyboard, "startHandler");
    }
  } catch (err) {
    errorHandler(err, "fatal", "Error inside startHandler");
  }
}

const sendStartMessageHelpers = {
  createGreetingText(firstName: string) {
    let greeting = `Привет, ${firstName}. С возвращением `;
    greeting += "в меню бота клуба любителей английского языка.\n";
    greeting += "Чем я могу помочь?";
    return greeting;
  },
  subStatusGetter(sub_status: SubStatusNames): "pending" | "paid" | boolean {
    if (sub_status === "active") {
      return true;
    } else if (sub_status === "unactive") {
      return false;
    } else {
      return sub_status;
    }
  },
  async sendPayMessages(ctx: MyContext, subStatus: "pending" | "paid") {
    if (subStatus === "pending") {
      await sendPayMessage(ctx);
    } else {
      await sendPaidMessage(ctx);
    }
  },
  ctxFiller(ctx: MyContext, user: User, userSub: UserSubscription) {
    const { sub_number, sub_status } = userSub;

    const userSession = ctx.session.user;
    userSession.firstName = user.first_name;
    userSession.secondName = user.second_name;

    if (sub_number === 1 && sub_status === "active") {
      userSession.isNewbie = true;
    }
    return { userSession, sub_status };
  },
};
