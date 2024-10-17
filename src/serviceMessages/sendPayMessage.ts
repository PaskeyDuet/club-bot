import subDetailsControllers from "../dbSetup/handlers/subDetailsControllers";
import { waitForPayKeyboard } from "../keyboards/subKeyboards";
import { MyContext } from "../types/grammy.types";
import { Message, Update } from "grammy/types";

export default async function (ctx: MyContext) {
  let updatedCtx:
    | Message.TextMessage
    | true
    | (Update.Edited &
        Message.CommonMessage & {
          text: string;
        });
  const SubDetails = await subDetailsControllers.findSubWithDetails(ctx.userId);
  console.log("subdetails", SubDetails);
  if (SubDetails?.sub_price) {
    let payText = `К оплате ${SubDetails?.sub_price}р\n`;
    payText += "Если уже оплатили, нажмите 'Оплачено'. ";
    payText += "Вы также можете отменить платёж";
    if (ctx.match) {
      updatedCtx = await ctx.editMessageText(payText, {
        reply_markup: waitForPayKeyboard,
      });
    } else {
      updatedCtx = await ctx.reply(payText, {
        reply_markup: waitForPayKeyboard,
      });
      ctx.session.lastMsgId = updatedCtx.message_id;
    }
  } else {
    throw new Error("No subDetails info");
  }
}
