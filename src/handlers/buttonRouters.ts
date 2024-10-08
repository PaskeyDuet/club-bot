import { Composer } from "grammy";
import { MyContext } from "../types/grammy.types";
import { infoUnits, sendInfoMessage } from "../controllers/infoUnit";
import { sendSubMessage } from "../controllers/subscriptionUnit";

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

keyboard.on("pre_checkout_query", async (ctx) => {
  console.log("precheck");
  return ctx.answerPreCheckoutQuery(true).catch(() => {
    console.log("err");
  });
});

keyboard.on(":successful_payment", async (ctx) => {
  console.log("success");
});
