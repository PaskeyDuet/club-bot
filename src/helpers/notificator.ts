import errorHandler from "#handlers/logErrorAndThrow.ts";
import { admin } from "#root/bot.ts";
import logger from "#root/logger.ts";
import { InlineKeyboard } from "grammy";

export default {
  async newSub(ctx: MyContext) {
    let messageText = "Была оплачена новая подписка";
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
