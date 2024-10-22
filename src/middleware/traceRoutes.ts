import guardExp from "../helpers/guardExp";
import sendStartMessage from "../serviceMessages/sendStartMessage";
import { NextFunction } from "grammy";
import { CallbackCtx, MyContext } from "../types/grammy.types";

export default async function (ctx: MyContext, next: NextFunction) {
  const cbMessageId = ctx?.callbackQuery?.message?.message_id;
  const updateMessageId = ctx?.update?.message?.message_id;

  let currentMsgId: number | undefined = cbMessageId ?? updateMessageId;
  guardExp(currentMsgId, "traceRoutes error, currentMsgId");

  let lastMsgId = ctx.session.lastMsgId ?? 0;

  if (currentMsgId < lastMsgId || lastMsgId === 0) {
    return await sendStartMessage(ctx);
  } else {
    ctx.session.lastMsgId = currentMsgId;

    if (ctx?.callbackQuery) {
      callbackTracer(<CallbackCtx>ctx);
    }

    await next();
  }
}

async function callbackTracer(ctx: CallbackCtx) {
  const cb = ctx.callbackQuery;
  guardExp(cb.message, "callackTracer error, cbQMessage.text");

  const cbQMessage = cb.message;
  if (cbQMessage.photo) {
    await ctx.api.deleteMessage(cbQMessage.chat.id, cbQMessage.message_id);
  }
  if (ctx.session.editMode === false) {
    cbQMessage.text = cbQMessage.caption;
  }

  guardExp(cbQMessage.text, "callackTracer error, cbQMessage.text");
  guardExp(
    cbQMessage.reply_markup,
    "callackTracer error, cbQMessage.reply_markup"
  );

  ctx.session.routeHistory.push({
    text: cbQMessage.text,
    reply_markup: cbQMessage.reply_markup,
  });
}
