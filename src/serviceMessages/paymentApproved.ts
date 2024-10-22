import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";
import subscriptionController from "#root/dbSetup/handlers/subscriptionController.ts";
import smoothReplier from "#root/helpers/smoothReplier.ts";
import { mainMenu } from "../keyboards/generalKeyboards";
import { MyContext } from "../types/grammy.types";
import newSubNotif from "./adminSection/newSubNotif";

export default async function (ctx: MyContext) {
  try {
    const updateResult = await subscriptionController.updateSubStatus(
      ctx.userId,
      "paid"
    );
    console.log("UpdateStatus\n", updateResult);
    let messageText = "Информация передана нашему менеджеру.\n";
    messageText += "Как только мы подтвердим платёж, вам придёт уведомление ";
    messageText += "и станет доступна возможность записаться на занятие";
    await smoothReplier(ctx, messageText, mainMenu, "paymentApproved");
    await newSubNotif(ctx);
  } catch (error) {
    logErrorAndThrow(error, "fatal", `Error inside paymentApproved`);
  }
}
