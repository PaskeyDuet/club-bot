import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";
import { subscriptionController } from "#db/handlers/index.ts";
import { mainMenu } from "#keyboards/generalKeyboards";
import { notificator, smoothReplier } from "#helpers/index.ts";

export default async function (ctx: MyContext, status: "paid" | "unactive") {
  try {
    await subscriptionController.updateSubStatus(ctx.userId, status);
    const messageText = messageTexts[status]();
    await smoothReplier(ctx, messageText, mainMenu, "paymentManagment");
    if (status === "paid") {
      await notificator.newSub(ctx);
    } else {
    }
  } catch (error) {
    logErrorAndThrow(error, "fatal", `Error inside paymentApproved`);
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
