import errorHandler from "#handlers/logErrorAndThrow.js";
import { admin } from "#root/bot.js";
import logger from "#root/logger.js";
import type { MyContext } from "#types/grammy.types.js";
import type { InlineKeyboard } from "grammy";

export default {
  async newSub(ctx: MyContext) {
    const messageText = "Была оплачена новая подписка";
    try {
      await ctx.api.sendMessage(-1002389280014, messageText, {
        message_thread_id: 5,
      });
    } catch (error) {
      logger.warn("Can't send notification about new subscription");
      await ctx.api.sendMessage(335815247, messageText).catch((err) => {
        errorHandler(
          err,
          "fatal",
          "Can't send notification about new subscription"
        );
      });
    }
  },
  async sendMessageById(
    text: string,
    userId: number,
    replyMarkup?: InlineKeyboard
  ) {
    await admin.sendMessage(userId, text, {
      reply_markup: replyMarkup,
      parse_mode: "HTML",
    });
  },
  async sendBulkMessages(
    text: string,
    userIds: number[],
    replyMarkup?: InlineKeyboard
  ) {
    const messPromises = userIds.map((id) =>
      this.sendMessageById(text, id, replyMarkup)
    );
    return await Promise.all(messPromises);
  },
};
