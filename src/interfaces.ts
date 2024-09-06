import { InlineKeyboardButton, InlineKeyboardMarkup } from "grammy/types";

interface User {
  fio: string;
  isNewbie: boolean;
}

export interface routeHistoryUnit {
  text: string;
  reply_markup: InlineKeyboardMarkup;
}

export interface SessionData {
  user: User;
  routeHistory: Array<routeHistoryUnit>; // Укажите тип элементов, если это строки, или другой тип, если необходимо
  lastMsgId: number;
  editMode: boolean;
}
