import dotenv from "dotenv";
import { Bot, GrammyError, HttpError, session } from "grammy";
import sessionConfig from "./botConfig/sessionConfig";
import { keyboard } from "./handlers/buttonRouters";
import { conversations, createConversation } from "@grammyjs/conversations";
import sendStartMessage from "./serviceMessages/sendStartMessage";
import traceRoutes from "./middleware/traceRoutes";
import userRegistrationConv from "./conversations/userRegistrationConv";
import ctxExtender from "./middleware/ctxExtender";
import { sequelize } from "./dbSetup/dbClient";
import { MyContext, routeHistoryUnit } from "./types/grammy.types";
import { newbieSubConv } from "./conversations/subscriptionConvs/newbieSubConv";
import { subConv } from "./conversations/subscriptionConvs/subConv";
import Meetings from "./dbSetup/models/Meetings";
import dates from "./helpers/dates";
import createFutureMeetingsList from "./helpers/createFutureMeetingsList";
import { registrationForMeeting } from "./conversations/registrationForMeeting";

dotenv.config();

(async () => {
  await sequelize.sync();
  // await Meetings.create({
  //   topic: "Worlkd",
  //   date: dates.dateFromString("2024-11-23 12:03"),
  //   place: "Moscow",
  // });
  // await Meetings.create({
  //   topic: "Moscow",
  //   date: dates.dateFromString("2024-01-23 11:03"),
  //   place: "Moscow",
  // });
  // await Meetings.create({
  //   topic: "Russ",
  //   date: dates.dateFromString("2024-10-23 10:03"),
  //   place: "Moscow",
  // });
  console.log("Database synced");
})();

const token = process.env.BOT_API_TOKEN;
if (!token) {
  throw new Error("There is no bot token");
}
const bot = new Bot<MyContext>(token);
bot.use(
  session({
    initial: () => structuredClone(sessionConfig),
  })
);
bot.use(conversations());
bot.use(createConversation(userRegistrationConv, "userReg"));
bot.use(createConversation(registrationForMeeting));
bot.use(createConversation(newbieSubConv));
bot.use(createConversation(subConv));
bot.use(traceRoutes);
bot.use(ctxExtender);
bot.use(keyboard);

bot.command("start", async (ctx: MyContext) => {
  await sendStartMessage(ctx);
});

bot.callbackQuery("back", async (ctx: MyContext) => {
  const canEdit = ctx.session.editMode;
  await ctx.session.routeHistory.pop(); //фальшивка
  const routeParams: routeHistoryUnit = ctx.session.routeHistory.pop()!;
  // ctx.session.conversation = {};

  if (canEdit) {
    await ctx.editMessageText(routeParams.text, {
      reply_markup: routeParams.reply_markup,
      parse_mode: "HTML",
    });
  } else {
    await ctx.reply(routeParams.text, {
      reply_markup: routeParams.reply_markup,
      parse_mode: "HTML",
    });
    //FIXME
    ctx.session.editMode = true;
  }
  ctx.answerCallbackQuery();
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
