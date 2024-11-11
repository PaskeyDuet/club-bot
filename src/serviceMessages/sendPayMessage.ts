import { subDetailsControllers } from "#db/handlers/index.js";
import { waitForPayKeyboard } from "#keyboards/index.js";
import { smoothReplier, guardExp } from "#helpers/index.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import type { MyContext } from "#types/grammy.types.js";

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
