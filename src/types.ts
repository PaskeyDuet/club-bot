import { Context, Filter, SessionFlavor } from "grammy";
import { SessionData } from "./interfaces";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";

export type MyContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor;
type MyConversation = Conversation<MyContext>;
export type CallbackCtx = Filter<MyContext, "callback_query">;
