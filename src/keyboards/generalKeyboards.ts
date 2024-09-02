import { InlineKeyboard } from "grammy";

//TODO: Если подписка есть, не добавлять кнопку
//TODO: Если человек зашёл не в первый раз, вместо куда я попал добавлять ИНФО кнопку
export const greetingKeyboard = new InlineKeyboard()
  .text("Куда я попал?")
  .row()
  .text("Попасть на занятие")
  .row()
  .text("Расписание");
