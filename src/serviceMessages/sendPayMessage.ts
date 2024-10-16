import subDetailsControllers from "../dbSetup/handlers/subDetailsControllers";
import subscriptionHandler from "../dbSetup/handlers/subscriptionHandler";
import Subscription from "../dbSetup/models/Subscription";
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
  const SubDetails = subscriptionHandler.findSubWithDetails(ctx.userId);
  console.log(SubDetails);

  let payText = "";
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
}
