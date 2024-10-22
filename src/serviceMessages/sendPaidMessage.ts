import smoothReplier from "#helpers/smoothReplier.ts";
import logErrorAndThrow from "#root/handlers/logErrorAndThrow.ts";
import logger from "#root/logger.ts";
import { greetingKeyboard } from "../keyboards/generalKeyboards";
import { MyContext } from "../types/grammy.types";

export default async (ctx: MyContext) => {
  let paidText = "Ваш платёж находится в обработке";
  try {
    const keyboard = greetingKeyboard(false, false, true);

    await smoothReplier(ctx, paidText, keyboard, "sendPaidMessages");
  } catch (err) {
    logErrorAndThrow(err, "fatal", "unable to sendPaidMessage");
  }
};
