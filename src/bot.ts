import dotenv from "dotenv";
import { Api, Bot, GrammyError, HttpError, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import sessionConfig from "./botConfig/sessionConfig";
import { registrationForMeeting } from "#conv/registrationForMeeting.js";
import { newbieSubConv } from "#conv/subscriptionConvs/newbieSubConv.js";
import { subConv } from "#conv/subscriptionConvs/subConv.js";
import ctxExtender from "#middleware/ctxExtender.js";
import traceRoutes from "#middleware/traceRoutes.js";
import sendAdminMenu from "#serviceMessages/sendAdminMenu.js";
import userRegistrationConv from "#conv/userRegistrationConv.js";
import { sequelize } from "#db/dbClient.js";
import { keyboard } from "#handlers/buttonRouters.js";
import handleBackButton from "#handlers/handleBackButton.js";
import logger from "#root/logger.js";
import { createMeetingConv } from "#conv/createMeeting.js";
import dates from "#helpers/dates.js";
import startHandler from "#serviceMessages/startHandler.js";
import User from "#db/models/User.js";
import { Op } from "sequelize";
import type { MyContext } from "#types/grammy.types";
import { paymentsManaging } from "#conv/subscriptionConvs/subPaymentApprove.js";

dotenv.config();
(async () => {
  logger.info("bot is running");
  await sequelize.sync({ alter: true });
  // await Meetings.truncate({ cascade: true });
  // await MeetingsDetails.truncate({ cascade: true });
  // await User.destroy({ where: { user_id: 335815247 } });
  // await MeetingsDetails.destroy({ where: { user_id: 335815247 } });
  const data = await User.findAll({
    where: { user_id: { [Op.ne]: 0 } },
  });
  console.log(data);

  // console.log(await Subscription.findAll());
  // console.log(await Meetings.findAll());
  // await UserSubscription.update(
  //   { sub_number: 3, sub_status: "unactive" },
  //   { where: { user_id: [335815247] } }
  // );
  // console.log(
  //   await UserSubscription.findOne({ where: { user_id: 335815247 } })
  // );
  // await Subscription.update(
  //   { sub_number: 1, sub_status: "unactive" },
  //   { where: { user_id: 1973775175 } }
  // );
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
  //   sub_name: "Free tier",
  // });
  // await SubDetails.create({
  //   duration_days: 30,
  //   sub_price: 100,
  //   sub_name: "Moth sub",
  // });
  // await SubDetails.create({
  //   duration_days: 60,
  //   sub_price: 1000,
  //   sub_name: "Three moths sub",
  // });
  // await SubDetails.create({
  //   duration_days: 1200,
  //   sub_price: 10000,
  //   sub_name: "Ultima sub",
  // });
  logger.info("Database synced");
})();

const token = process.env.BOT_API_TOKEN;
if (!token) {
  throw new Error("There is no bot token");
}
export const bot = new Bot<MyContext>(token);
export const admin = new Api(token);
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
bot.use(createConversation(paymentsManaging));
bot.use(createConversation(createMeetingConv));
bot.use(ctxExtender);
bot.use(traceRoutes);
bot.use(keyboard);

bot.command("date", async (ctx) => {
  dates.isDatePassed(dates.dateFromString("12-12-2024 10:30"));
});

bot.command("admin", async (ctx) => {
  try {
    await sendAdminMenu(ctx);
  } catch (err) {
    const error = err as Error;
    logger.fatal(
      `unable to send sendAdminMenu: ${error.message}, \nError stack:\n${error.stack}`
    );
    throw new Error("unable to send sendAdminMenu");
  }
});

bot.command("start", async (ctx: MyContext) => {
  try {
    await startHandler(ctx);
  } catch (err) {
    const error = err as Error;
    logger.fatal(
      `unable to send startMessage: ${error.message}, \nError stack:\n${error.stack}`
    );
    throw new Error("unable to send startMessage");
  }
});

bot.callbackQuery("back", async (ctx: MyContext) => {
  try {
    await handleBackButton(ctx);
  } catch (err) {
    const error = err as Error;
    logger.fatal(
      `unable to hange handleBackButton: ${error.message}, \nError stack:\n${error.stack}`
    );
    throw new Error("unable to handle handleBackButton");
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  logger.fatal(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    logger.fatal(`Error in request:\n${e}`);
  } else if (e instanceof HttpError) {
    logger.fatal(`Could not contact Telegram:\n${e}`);
  } else {
    logger.fatal(`Unknown error:\n${e}`);
  }
  ctx.reply("На данный момент бот на покое. Зайдите позже");
});

bot.start();
