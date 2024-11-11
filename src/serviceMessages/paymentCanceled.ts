import { subscriptionController } from "#db/handlers/index.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import { smoothReplier } from "#helpers/index.js";
import { mainMenu } from "#keyboards/generalKeyboards.js";
import type { MyContext } from "#types/grammy.types.js";

export default async function (ctx: MyContext) {
  try {
    await subscriptionController.updateSubStatus(ctx.userId, "unactive");

    const messageText = "Запрос на подписку успешно отменён";
    await smoothReplier(ctx, messageText, mainMenu, "paymentCanceled");
  } catch (error) {
    logErrorAndThrow(error, "fatal", "Error inside paymentApproved");
  }
}
