import { InlineKeyboardButton, InlineKeyboardMarkup } from "grammy/types";
import { Context, Filter, SessionFlavor } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";

export interface SessionData {
  user: TelegramUser;
  routeHistory: Array<routeHistoryUnit>; // Укажите тип элементов, если это строки, или другой тип, если необходимо
  lastMsgId: number;
  editMode: boolean;
}
export type MyContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor & {
    userId: number;
  };
export type MyConversation = Conversation<MyContext>;
export type CallbackCtx = Filter<MyContext, "callback_query">;

interface TelegramUser {
  firstName: string;
  secondName: string;
  isNewbie: boolean;
}

export interface routeHistoryUnit {
  text: string;
  reply_markup: InlineKeyboardMarkup;
}
