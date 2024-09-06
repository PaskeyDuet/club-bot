import dotenv from "dotenv";
import { Bot, Context, session, SessionFlavor } from "grammy";
import { greetingKeyboard } from "./keyboards/generalKeyboards";
import { routeHistoryUnit, SessionData } from "./interfaces";
import sessionConfig from "./bot_config/sessionConfig";
import { keyboard } from "./handlers/buttonRouters";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import sendStartMessage from "./serviceMessages/sendStartMessage";
import { MyContext } from "./types";
import traceRoutes from "./middleware/traceRoutes";

dotenv.config();

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
bot.use(traceRoutes);
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

bot.start();
