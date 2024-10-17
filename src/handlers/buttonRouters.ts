import { Composer } from "grammy";
import { MyContext } from "../types/grammy.types";
import { infoUnits, sendInfoMessage } from "../controllers/infoUnit";
import {
  paymentAccepted,
  paymentDeclined,
  paymentsManaging,
} from "../controllers/subscriptionUnit";
import sendStartMessage from "../serviceMessages/sendStartMessage";
import paymentApproved from "../serviceMessages/paymentApproved";

export const keyboard = new Composer<MyContext>();

keyboard.callbackQuery(/gen__/, async (ctx) => {
  const path = ctx.callbackQuery.data.split("gen__")[1];

  switch (path) {
    case "info":
      await sendInfoMessage(ctx);
      break;
    case "reg_for_meeting":
      await ctx.conversation.enter("registrationForMeeting");
      break;
    case "reg_for_meeting_newbie":
      await ctx.conversation.enter("newbieSubConv");
      break;
    case "create_sub":
      await ctx.conversation.enter("subConv");
      break;
    case "schedule":
      break;
    default:
      break;
  }
});

keyboard.callbackQuery(/info_/, async (ctx) => {
  const path: string = ctx.callbackQuery.data.split("info_")[1];

  switch (path) {
    case "who":
      infoUnits(ctx).who();
      break;
    case "where":
      infoUnits(ctx).where();
      break;
    case "when":
      infoUnits(ctx).when();
      break;
    default:
      break;
  }
});

keyboard.callbackQuery(/\bsub_/, async (ctx) => {
  const cbData = ctx.callbackQuery.data;
  const actionMatch = cbData.match(/_(\w+)_?/);
  let action = actionMatch ? actionMatch[1] : null;

  const userIdMatch = cbData.match(/_(\d+)$/);
  const userId = userIdMatch ? +userIdMatch[1] : null;

  if (userId) {
    // TODO: Добавить проверку
    const adminAction = action?.split("_")[0];

    switch (adminAction) {
      case "decline":
        await paymentDeclined(ctx, userId);
        break;
      case "accept":
        await paymentAccepted(ctx, userId);
        break;
    }
  } else {
    switch (action) {
      case "paid":
        await paymentApproved(ctx);
        break;
      case "manage":
        await paymentsManaging(ctx);
    }
  }
});

keyboard.callbackQuery("main_menu", async (ctx) => {
  await sendStartMessage(ctx);
});
