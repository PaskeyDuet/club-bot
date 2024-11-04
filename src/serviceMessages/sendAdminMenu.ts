import { adminMenuKeyboard } from "../keyboards/generalKeyboards";
import { MyContext } from "../types/grammy.types";
import errorHandler from "#handlers/logErrorAndThrow.ts";
import { subscriptionController } from "#root/dbSetup/handlers/index.ts";
import guardExp from "#root/helpers/guardExp.ts";
import smoothReplier from "#helpers/smoothReplier.ts";

export default async function (ctx: MyContext) {
  try {
    const paidSubs = await subscriptionController.findSubByQuery({
      sub_status: "paid",
    });
    guardExp(paidSubs, "paidSubs at sendAdminMenu");
    const foundNewSubs = paidSubs.length ? true : false;

    await smoothReplier(
      ctx,
      "There'll be some service info",
      adminMenuKeyboard(foundNewSubs),
      "sendAdminMenu"
    );
  } catch (err) {
    errorHandler(err, "warn", "Error at sendAdminMenu");
  }
}
