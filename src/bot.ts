import dotenv from "dotenv";
import { Bot, Context, session, SessionFlavor } from "grammy";
import { greetingKeyboard } from "./keyboards/generalKeyboards";
import { SessionData } from "./interfaces";
import sessionConfig from "./bot_config/sessionConfig";

dotenv.config();

type MyContext = Context & SessionFlavor<SessionData>;

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

bot.command("start", async (ctx) => {
  let greeting = "Привет. Добро пожаловать ";
  greeting += "в меню бота клуба любителей английского языка.";
  greeting += " Чем я могу помочь?";

  await ctx.reply(greeting, {
    reply_markup: greetingKeyboard,
  });
});

bot.hears("message", async (ctx) => {
  ctx.session.lastMsgId += 1;
  ctx.reply(ctx.session.lastMsgId.toString());
});

// // Set custom properties on context objects.
// bot.use(async (ctx, next) => {
//   ctx.config = {
//     botDeveloper: BOT_DEVELOPER,
//     isDeveloper: ctx.from?.id === BOT_DEVELOPER,
//   };
//   await next();
// });

// // Define handlers for custom context objects.
// bot.command("start", async (ctx) => {
//   console.log(ctx);
//   if (ctx.config.isDeveloper) await ctx.reply("Hi mom!");
//   else await ctx.reply("Welcome");
// });
bot.start();
