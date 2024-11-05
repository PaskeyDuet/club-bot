import { InlineKeyboardMarkup } from "grammy/types";
import { Filter } from "grammy";

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
