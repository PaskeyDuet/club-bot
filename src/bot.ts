import dotenv from "dotenv";
import { Bot, session } from "grammy";
import sessionConfig from "./botConfig/sessionConfig";
import { keyboard } from "./handlers/buttonRouters";
import { conversations, createConversation } from "@grammyjs/conversations";
import sendStartMessage from "./serviceMessages/sendStartMessage";
import traceRoutes from "./middleware/traceRoutes";
import User from "./dbSetup/models/User";
import userRegistrationConv from "./conversations/userRegistrationConv";
import ctxExtender from "./middleware/ctxExtender";
import { sequelize } from "./dbSetup/dbClient";
import { MyContext, routeHistoryUnit } from "./types/grammy.types";
import Subscription from "./dbSetup/models/Subscription";

dotenv.config();

(async () => {
  await sequelize.sync();
  // try {
  //   User.create({
  //     user_id: 23,
  //     reg_date: new Date().toISOString(),
  //     first_name: "Volodua",
  //     second_name: "ivan",
  //   });
  // } catch (error) {}
  console.log("Database synced");
})();

const token = process.env.BOT_API_TOKEN;
if (!token) {
  throw new Error("There is no bot token");
}
const bot = new Bot<MyContext>(token);
bot.use(keyboard);
bot.use(
  session({
    initial: () => structuredClone(sessionConfig),
  })
);
bot.use(conversations());
bot.use(createConversation(userRegistrationConv, "userReg"));
bot.use(traceRoutes);
bot.use(ctxExtender);

bot.command("start", async (ctx: MyContext) => {
  await sendStartMessage(ctx);
});

bot.callbackQuery("sub", async (ctx: MyContext) => {
  const data = await Subscription.create({
    user_id: ctx.userId,
    sub_date: new Date().toISOString(),
    sub_type: 1,
  });

  console.log(data);
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

bot.start();
