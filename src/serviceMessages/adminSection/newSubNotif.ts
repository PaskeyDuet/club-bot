import errorHandler from "#handlers/logErrorAndThrow.ts";
import logger from "#root/logger.ts";
import { MyContext } from "../../types/grammy.types";

export default async function (ctx: MyContext) {
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
}
