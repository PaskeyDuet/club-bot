import guardExp from "../helpers/guardExp";
import startHandler from "../serviceMessages/startHandler";
import { NextFunction } from "grammy";
import { CallbackCtx, MyContext } from "../types/grammy.types";
import sendAdminMenu from "#serviceMessages/sendAdminMenu.ts";

export default async function (ctx: MyContext, next: NextFunction) {
  const messObj = ctx.message;

  const cbMessageId = ctx?.callbackQuery?.message?.message_id;
  const updateMessageId = ctx?.update?.message?.message_id;

  let currentMsgId: number | undefined = cbMessageId ?? updateMessageId;
  guardExp(currentMsgId, "traceRoutes error, currentMsgId");

  let lastMsgId = ctx.session.lastMsgId ?? 0;
  const messText = ctx.message?.text;
  const isTopic = messObj?.is_topic_message;
  const isSupergroup = messObj?.chat.type === "supergroup";

  if (isTopic) {
    return;
  } else if (messText === "/admin") {
    return await sendAdminMenu(ctx);
  } else if (currentMsgId < lastMsgId || lastMsgId === 0) {
    if (isSupergroup) {
      return;
    } else {
      return await startHandler(ctx);
    }
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
