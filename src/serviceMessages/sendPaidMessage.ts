import { smoothReplier } from "#helpers/index.js";
import logErrorAndThrow from "#root/handlers/logErrorAndThrow.js";
import { greetingKeyboard } from "#keyboards/index.js";
import type { MyContext } from "#types/grammy.types.js";

export default async (ctx: MyContext) => {
  const paidText = "Ваш платёж находится в обработке";
  try {
    const keyboard = greetingKeyboard(false, false, true);
    await smoothReplier(ctx, paidText, keyboard, "sendPaidMessages");
  } catch (err) {
    logErrorAndThrow(err, "fatal", "unable to sendPaidMessage");
  }
};
