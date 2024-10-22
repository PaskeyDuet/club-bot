import subscriptionHandler from "../../dbSetup/handlers/subscriptionController";
import { adminMenuKeyboard } from "../../keyboards/generalKeyboards";
import { MyContext } from "../../types/grammy.types";
import errorHandler from "#handlers/logErrorAndThrow.ts";

export default async function (ctx: MyContext) {
  try {
    const paidSubs = await subscriptionHandler.findSubByQuery({
      sub_status: "paid",
    });
    if (paidSubs) {
      const foundNewSubs = paidSubs.length ? true : false;
      const updatedCtx = await ctx.reply("There'll be some service info", {
        reply_markup: adminMenuKeyboard(foundNewSubs),
      });
      ctx.session.lastMsgId = updatedCtx.message_id;
    } else {
      throw new Error("empty paidSubs at sendAdminMenu");
    }
  } catch (err) {
    errorHandler(err, "warn", "Error at sendAdminMenu");
  }
}
