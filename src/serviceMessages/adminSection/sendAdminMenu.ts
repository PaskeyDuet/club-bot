import subscriptionHandler from "../../dbSetup/handlers/subscriptionHandler";
import { adminMenuKeyboard } from "../../keyboards/generalKeyboards";
import { MyContext } from "../../types/grammy.types";

export default async function (ctx: MyContext) {
  const paidSubs = await subscriptionHandler.findSubByQuery({
    sub_status: "paid",
  });
  const foundNewSubs = paidSubs.length ? true : false;

  const updatedCtx = await ctx.reply("There'll be some service info", {
    reply_markup: adminMenuKeyboard(foundNewSubs),
  });
  ctx.session.lastMsgId = updatedCtx.message_id;
}
