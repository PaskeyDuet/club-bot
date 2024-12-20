import {
  Api,
  Bot,
  GrammyError,
  HttpError,
  MemorySessionStorage,
  session,
} from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import sessionConfig from "#root/botConfig/sessionConfig.js";
import { registrationForMeeting } from "#conv/registrationForMeeting.js";
import { newbieSubConv } from "#conv/subscriptionConvs/newbieSubConv.js";
import { subConv } from "#conv/subscriptionConvs/subConv.js";
import logger from "#root/logger.js";
import { sequelize } from "#db/dbClient.js";
import Meetings from "#db/models/Meetings.js";
import type { MyContext } from "#types/grammy.types.js";
import userRegistrationConv from "#conv/userRegistrationConv.js";
import { paymentsManaging } from "#conv/subscriptionConvs/subPaymentApprove.js";
import { createMeetingConv } from "#conv/createMeeting.js";
import ctxExtender from "#middleware/ctxExtender.js";
import traceRoutes from "#middleware/traceRoutes.js";
import { keyboard } from "#handlers/buttonRouters.js";
import sendAdminMenu from "#serviceMessages/sendAdminMenu.js";
import startHandler from "#serviceMessages/startHandler.js";
import handleBackButton from "#handlers/handleBackButton.js";
import scheduledServices from "#helpers/scheduledServices.js";
import { hydrateFiles } from "@grammyjs/files";
import sanitizedConfig from "./config.js";
import changeName from "#conv/changeName.js";
import meetingFeedback from "#conv/feebackConv.js";
import User from "#db/models/User.js";
import UserSubscription from "#db/models/UserSubscription.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import { mainMenu } from "#keyboards/generalKeyboards.js";
import { chatMembers, type ChatMembersFlavor } from "@grammyjs/chat-members";
import type { ChatMember } from "grammy/types";
import { groupInit, addUserToGroup } from "#controllers/index.js";
import UsersGroups from "#db/models/UsersGroups.js";
import GroupsMembers from "#db/models/GroupsMembers.js";

(async () => {
  logger.info("bot is running");
  await sequelize.sync({ alter: true });
  console.log(await UsersGroups.findAll());
  console.log(await GroupsMembers.findAll());
  // await VocabularyTags.truncate({ cascade: true, restartIdentity: true });
  // await MeetingsVocabulary.truncate({ cascade: true, restartIdentity: true });
  // await MeetingsDetails.truncate({ cascade: true, restartIdentity: true });
  // await Meetings.truncate({ cascade: true, restartIdentity: true });
  // await User.truncate({ cascade: true, restartIdentity: true });
  // await UserSubscription.truncate({ cascade: true, restartIdentity: true });

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
scheduledServices();
const token = sanitizedConfig.BOT_API_TOKEN;
if (!token) {
  throw new Error("There is no bot token");
}
export const bot = new Bot<MyContext>(token);
bot.api.config.use(hydrateFiles(token));
export const admin = new Api(token);

bot.use(
  session({
    initial: () => structuredClone(sessionConfig),
  })
);
// bot.use(chatMembers(adapter))
bot.use(conversations());
bot.use(createConversation(userRegistrationConv));
bot.use(createConversation(registrationForMeeting));
bot.use(createConversation(newbieSubConv));
bot.use(createConversation(subConv));
bot.use(createConversation(paymentsManaging));
bot.use(createConversation(createMeetingConv));
bot.use(createConversation(changeName));
bot.use(createConversation(meetingFeedback));
bot.use(ctxExtender);
bot.use(traceRoutes);
bot.use(keyboard);

bot.on(":new_chat_members", async (ctx) => console.log(ctx));

bot.command("admin", sendAdminMenu);
bot.command("init", groupInit);

bot.command("start", startHandler);

bot.callbackQuery("back", handleBackButton);

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
  ctx.reply("На данный момент бот на покое.", { reply_markup: mainMenu });
});

bot.start({ allowed_updates: ["chat_member", "message", "callback_query"] });
