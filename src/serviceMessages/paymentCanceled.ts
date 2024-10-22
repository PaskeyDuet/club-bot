import subscriptionController from "#root/dbSetup/handlers/subscriptionController.ts";
import logErrorAndThrow from "#root/handlers/logErrorAndThrow.ts";
import smoothReplier from "#root/helpers/smoothReplier.ts";
import { mainMenu } from "#root/keyboards/generalKeyboards.ts";
import { MyContext } from "#root/types/grammy.types.ts";

export default async function (ctx: MyContext) {
  try {
    await subscriptionController.updateSubStatus(ctx.userId, "unactive");

    let messageText = "Запрос на подписку успешно отменён";
    await smoothReplier(ctx, messageText, mainMenu, "paymentCanceled");
  } catch (error) {
    logErrorAndThrow(error, "fatal", `Error inside paymentApproved`);
  }
}
