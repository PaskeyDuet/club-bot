import { adminMenuKeyboard } from "#keyboards/index.js";
import errorHandler from "#handlers/logErrorAndThrow.js";
import { smoothReplier, guardExp } from "#helpers/index.js";
import type { MyContext } from "#types/grammy.types.js";
import { subscriptionController } from "#db/handlers/index.js";

export default async function (ctx: MyContext) {
  ctx.session.conversation = {};
  try {
    const paidSubs = await subscriptionController.findSubByQuery({
      sub_status: "paid",
    });
    guardExp(paidSubs, "paidSubs at sendAdminMenu");
    const foundNewSubs = !!paidSubs.length;

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
