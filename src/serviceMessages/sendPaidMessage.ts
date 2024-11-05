import { smoothReplier } from "#helpers/index.ts";
import logErrorAndThrow from "#root/handlers/logErrorAndThrow.ts";
import { greetingKeyboard } from "#keyboards/index.ts";

export default async (ctx: MyContext) => {
  let paidText = "Ваш платёж находится в обработке";
  try {
    const keyboard = greetingKeyboard(false, false, true);
    await smoothReplier(ctx, paidText, keyboard, "sendPaidMessages");
  } catch (err) {
    logErrorAndThrow(err, "fatal", "unable to sendPaidMessage");
  }
};
