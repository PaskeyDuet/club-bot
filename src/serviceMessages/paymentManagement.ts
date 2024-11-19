import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import { subscriptionController } from "#db/handlers/index.js";
import { mainMenu } from "#keyboards/generalKeyboards.js";
import { notificator, smoothReplier } from "#helpers/index.js";
import type { MyContext } from "#types/grammy.types.js";

export default async function (ctx: MyContext, status: "paid" | "unactive") {
  try {
    await subscriptionController.updateSubStatus(ctx.userId, status);
    const messageText = messageTexts[status]();
    await smoothReplier(ctx, messageText, mainMenu, "paymentManagment");
    if (status === "paid") {
      await notificator.newSub();
    } else {
    }
  } catch (error) {
    logErrorAndThrow(error, "fatal", "Error inside paymentApproved");
  }
}

const messageTexts = {
  paid: () => {
    let messageText = "Информация передана нашему менеджеру.\n";
    messageText += "Как только мы подтвердим платёж, вам придёт уведомление ";
    messageText += "и станет доступна возможность записаться на занятие";
    return messageText;
  },
  unactive: () => "Запрос на подписку успешно отменён",
};
