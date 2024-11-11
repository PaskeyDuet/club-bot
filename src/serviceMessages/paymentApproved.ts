import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import { subscriptionController } from "#db/handlers/index.js";
import { mainMenu } from "#keyboards/generalKeyboards.js";
import { notificator, smoothReplier } from "#helpers/index.js";
import type { MyContext } from "#types/grammy.types.js";

export default async function (ctx: MyContext) {
  try {
    await subscriptionController.updateSubStatus(ctx.userId, "paid");
    const messageText = generateMessageText();
    await smoothReplier(ctx, messageText, mainMenu, "paymentApproved");
    await notificator.newSub(ctx);
  } catch (error) {
    logErrorAndThrow(error, "fatal", "Error inside paymentApproved");
  }
}

const generateMessageText = () => {
  let messageText = "Информация передана нашему менеджеру.\n";
  messageText += "Как только мы подтвердим платёж, вам придёт уведомление ";
  messageText += "и станет доступна возможность записаться на занятие";
  return messageText;
};
