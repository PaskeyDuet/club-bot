import errorHandler from "#handlers/logErrorAndThrow.js";
import { admin } from "#root/bot.js";
import logger from "#root/logger.js";
import type { MyContext } from "#types/grammy.types.js";
import type { InlineKeyboard } from "grammy";

class notificator {
  serviceGroupId: number;
  serviceTopics: {
    subTopic: number;
    feedbackTopic: number;
  };
  adminIds: number[];

  constructor() {
    this.serviceGroupId = -1002389280014;
    this.serviceTopics = {
      subTopic: 5,
      feedbackTopic: 207,
    };
    this.adminIds = [335815247];
  }

  async newSub() {
    const messageText = "Была оплачена новая подписка";
    try {
      await admin.sendMessage(this.serviceGroupId, messageText, {
        message_thread_id: this.serviceTopics.subTopic,
      });
    } catch (error) {
      logger.warn("Can't send notification about new subscription");
      await this.sendBulkMessages(messageText, this.adminIds);
    }
  }

  async newFeedback(feedback: string) {
    admin.sendMessage(this.serviceGroupId, feedback, {
      message_thread_id: this.serviceTopics.feedbackTopic,
    });
  }

  async sendMessageById(
    text: string,
    userId: number,
    replyMarkup?: InlineKeyboard
  ) {
    await admin.sendMessage(userId, text, {
      reply_markup: replyMarkup,
      parse_mode: "HTML",
    });
  }

  async sendBulkMessages(
    text: string,
    userIds: number[],
    replyMarkup?: InlineKeyboard
  ) {
    const messPromises = userIds.map((id) =>
      this.sendMessageById(text, id, replyMarkup)
    );
    return await Promise.all(messPromises);
  }
}

export default new notificator();
