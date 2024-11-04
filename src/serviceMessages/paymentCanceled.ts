import { subscriptionController } from "#db/handlers/index.ts";
import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";
import smoothReplier from "#helpers/smoothReplier.ts";
import { mainMenu } from "#keyboards/generalKeyboards.ts";
import { MyContext } from "#types/grammy.types.ts";

export default async function (ctx: MyContext) {
  try {
    await subscriptionController.updateSubStatus(ctx.userId, "unactive");

    let messageText = "Запрос на подписку успешно отменён";
    await smoothReplier(ctx, messageText, mainMenu, "paymentCanceled");
  } catch (error) {
    logErrorAndThrow(error, "fatal", `Error inside paymentApproved`);
  }
}
