import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";
import { subscriptionController } from "#db/handlers/index.ts";
import smoothReplier from "#root/helpers/smoothReplier.ts";
import { mainMenu } from "../keyboards/generalKeyboards";
import { MyContext } from "../types/grammy.types";
import notificator from "#helpers/notificator.ts";

export default async function (ctx: MyContext) {
  try {
    await subscriptionController.updateSubStatus(ctx.userId, "paid");
    const messageText = generateMessageText();
    await smoothReplier(ctx, messageText, mainMenu, "paymentApproved");
    await notificator.newSub(ctx);
  } catch (error) {
    logErrorAndThrow(error, "fatal", `Error inside paymentApproved`);
  }
}

const generateMessageText = () => {
  let messageText = "Информация передана нашему менеджеру.\n";
  messageText += "Как только мы подтвердим платёж, вам придёт уведомление ";
  messageText += "и станет доступна возможность записаться на занятие";
  return messageText;
};
