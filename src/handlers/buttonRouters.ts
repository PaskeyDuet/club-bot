import { Composer } from "grammy";
import { MyContext } from "../types/grammy.types";
import { infoUnits, sendInfoMessage } from "../controllers/infoUnit";
import { sendSubMessage } from "../controllers/subscriptionUnit";
import sendStartMessage from "../serviceMessages/sendStartMessage";

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

keyboard.callbackQuery("main_menu", async (ctx) => {
  await sendStartMessage(ctx);
});
