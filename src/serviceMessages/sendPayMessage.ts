import { subDetailsControllers } from "#db/handlers/index.ts";
import { waitForPayKeyboard } from "../keyboards/subKeyboards";
import { MyContext } from "../types/grammy.types";
import smoothReplier from "#helpers/smoothReplier.ts";
import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";
import guardExp from "#root/helpers/guardExp.ts";

export default async function (ctx: MyContext) {
  try {
    const SubDetails = await subDetailsControllers.findSubWithDetails(
      ctx.userId
    );
    guardExp(SubDetails?.sub_price, "SubDetails");

    const payText = createPayText(SubDetails.sub_price);
    await smoothReplier(ctx, payText, waitForPayKeyboard, "sendPayMessage");
  } catch (error) {
    logErrorAndThrow(error, "fatal", "Error inside sendPayMessage");
  }
}

const createPayText = (price: number) => {
  let payText = `К оплате ${price}р\n`;
  payText += "Если уже оплатили, нажмите 'Оплачено'. ";
  payText += "Вы также можете отменить платёж";
  return payText;
};
