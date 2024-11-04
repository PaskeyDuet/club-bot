import { InlineKeyboardButton, InlineKeyboardMarkup } from "grammy/types";
import { Api, Context, Filter, RawApi, SessionFlavor } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";

export interface SessionData {
  user: TelegramUser;
  temp: {
    meetingNumber: number | null;
    meetingParams: {
      date: string;
      place: string;
      topic: string;
    };
    sub_number: number | null;
  };
  routeHistory: Array<routeHistoryUnit>; // Укажите тип элементов, если это строки, или другой тип, если необходимо
  lastMsgId: number;
  editMode: boolean;
  conversation: object;
}
export type MyContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor & {
    userId: number;
    chatId: number;
  };
export type MyConversation = Conversation<MyContext>;
export type CallbackCtx = Filter<MyContext, "callback_query">;

interface TelegramUser {
  firstName: string;
  secondName: string;
  isNewbie: boolean;
  hasSub: boolean;
}

export interface routeHistoryUnit {
  text: string;
  reply_markup: InlineKeyboardMarkup;
}
