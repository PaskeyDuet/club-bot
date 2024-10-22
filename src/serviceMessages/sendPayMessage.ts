import logger from "#root/logger.ts";
import subDetailsControllers from "../dbSetup/handlers/subDetailsControllers";
import { waitForPayKeyboard } from "../keyboards/subKeyboards";
import { MyContext } from "../types/grammy.types";
import smoothReplier from "#helpers/smoothReplier.ts";
import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";

const createPayText = (price: number) => {
  let payText = `К оплате ${price}р\n`;
  payText += "Если уже оплатили, нажмите 'Оплачено'. ";
  payText += "Вы также можете отменить платёж";
  return payText;
};

export default async function (ctx: MyContext) {
  try {
    const SubDetails = await subDetailsControllers.findSubWithDetails(
      ctx.userId
    );
    if (!SubDetails?.sub_price) {
      logger.fatal("No subDetails info");
      throw new Error("No subDetails info");
    }

    const payText = createPayText(SubDetails.sub_price);
    await smoothReplier(ctx, payText, waitForPayKeyboard, "sendPayMessage");
  } catch (error) {
    logErrorAndThrow(error, "fatal", "Error inside sendPayMessage");
  }
}
