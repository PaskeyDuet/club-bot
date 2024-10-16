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
import { registrationForMeeting } from "./conversations/registrationForMeeting";
import Subscription from "./dbSetup/models/Subscription";
import SubDetails from "./dbSetup/models/SubDetails";

dotenv.config();
(async () => {
  await sequelize.sync({ alter: true });
  // const data = await meetingsController.futureMeetingsWithUsers();
  // await Meetings.create({
  //   topic: "Worlkd",
  //   date: dates.dateFromString("2024-11-23 12:03"),
  //   place: "Moscow 1",
  // });
  // await Meetings.create({
  //   topic: "Moscow",
  //   date: dates.dateFromString("2024-01-23 11:03"),
  //   place: "Moscow 2",
  // });
  // await Meetings.create({
  //   topic: "Russ",
  //   date: dates.dateFromString("2024-10-23 10:03"),
  //   place: "Moscow 3",
  // });
  // await Meetings.create({
  //   topic: "Our family",
  //   date: dates.dateFromString("2024-10-23 10:03"),
  //   place: "Moscow 4",
  // });
  // await SubDetails.create({
  //   duration_days: 99999,
  //   sub_price: 0,
  // });
  // await SubDetails.create({
  //   duration_days: 30,
  //   sub_price: 100,
  // });
  // await SubDetails.create({
  //   duration_days: 60,
  //   sub_price: 1000,
  // });
  // await SubDetails.create({
  //   duration_days: 1200,
  //   sub_price: 10000,
  // });
  // await SubDetails.update(
  //   { sub_name: "Free tier" },
  //   { where: { sub_number: 1 } }
  // );
  // await SubDetails.update(
  //   { sub_name: "Месячная подписка" },
  //   { where: { sub_number: 2 } }
  // );
  // await SubDetails.update(
  //   { sub_name: "Трехмесячная подписка" },
  //   { where: { sub_number: 3 } }
  // );
  // await SubDetails.update(
  //   { sub_name: "Годовая подписка" },
  //   { where: { sub_number: 4 } }
  // );
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
