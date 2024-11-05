import { adminMenuKeyboard } from "#keyboards/index.ts";
import errorHandler from "#handlers/logErrorAndThrow.ts";
import { smoothReplier, guardExp } from "#helpers/index.ts";
import subscriptionController from "#db/handlers/subscriptionController.ts";

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
