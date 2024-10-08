import { InlineKeyboard } from "grammy";

//TODO: Если подписка есть, не добавлять кнопку
//TODO: Если человек зашёл не в первый раз, вместо куда я попал добавлять ИНФО кнопку
export const greetingKeyboard = new InlineKeyboard()
  .text("Куда я попал?", "gen__info")
  .row()
  .text("Записаться на занятие", "gen__reg_for_meeting")
  .row()
  .text("Расписание", "gen__schedule");

export const infoKeyboards = {
  generalInfo: new InlineKeyboard()
    .text("Кто мы", "info_who")
    .text("Где мы", "info_where")
    .row()
    .text("Когда мы", "info_when")
    .row()
    .text("Главное меню", "back"),
  who: new InlineKeyboard().text("Назад", "back"),
  where: new InlineKeyboard().text("Назад", "back"),
  when: new InlineKeyboard().text("Назад", "back"),
};

export const mainMenu = new InlineKeyboard().text("Главное меню", "main_menu");
