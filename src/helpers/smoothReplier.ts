import { InlineKeyboard } from "grammy";
import { MyContext } from "types/grammy.types";
import { Message, Update } from "grammy/types";
import logger from "../logger";
import logErrorAndThrow from "#root/handlers/logErrorAndThrow.ts";

export default async function (
  ctx: MyContext,
  messageText: string,
  keyboard: InlineKeyboard,
  fnName: string
) {
  let updatedCtx: updatedCtxType;
  try {
    try {
      updatedCtx = await ctx.editMessageText(messageText, {
        reply_markup: keyboard,
      });
      console.log("unfo");
      return messageIdSaver(ctx, updatedCtx, fnName);
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      if (
        error.message.match(/message is not modified|message can't be edited/)
      ) {
        updatedCtx = await ctx.reply(messageText, {
          reply_markup: keyboard,
        });
        return messageIdSaver(ctx, updatedCtx, fnName);
      } else {
        throw new Error("impossible");
      }
    }
  } catch (err) {
    logErrorAndThrow(
      err,
      "fatal",
      `Error in ${fnName}. Unable to answer a user`
    );
  }
}

const messageIdSaver = (
  ctx: MyContext,
  updatedCtx: updatedCtxType,
  fnName: string
) => {
  if (updatedCtx && typeof updatedCtx !== "boolean") {
    ctx.session.lastMsgId = updatedCtx.message_id;
    return updatedCtx.message_id;
  } else {
    logger.warn(`Can't save last msg id inside ${fnName}`);
  }
};

type updatedCtxType =
  | Message.TextMessage
  | true
  | (Update.Edited &
      Message.CommonMessage & {
        text: string;
      });
