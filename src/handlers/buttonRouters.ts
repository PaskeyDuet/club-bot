import { Composer, Context } from "grammy";
import { MyContext } from "../types";
import { infoUnits, sendInfoMessage } from "../controllers/buttonControllers";

export const keyboard = new Composer<MyContext>();

keyboard.callbackQuery(/gen_/, async (ctx) => {
  const path = ctx.callbackQuery.data.split("gen_")[1];

  switch (path) {
    case "info":
      await sendInfoMessage(ctx);
      break;
    case "invite":
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
