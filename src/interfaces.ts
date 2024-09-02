import { InlineKeyboardButton } from "grammy/types";

interface User {
  fio: string;
  isNewbie: boolean;
}

interface routeHistoryUnit {
  text: string;
  reply_markup: InlineKeyboardButton[][];
}

export interface SessionData {
  user: User;
  routeHistory: Array<routeHistoryUnit>; // Укажите тип элементов, если это строки, или другой тип, если необходимо
  lastMsgId: number;
}
