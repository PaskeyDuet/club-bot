import { InlineKeyboard } from "grammy";

//TODO: Если подписка есть, не добавлять кнопку
//TODO: Если человек зашёл не в первый раз, вместо куда я попал добавлять ИНФО кнопку
export const greetingKeyboard = new InlineKeyboard()
  .text("Куда я попал?", "gen_info")
  .row()
  .text("Попасть на занятие", "gen_invite")
  .row()
  .text("Расписание", "gen_schedule");
// .row()
// .text("Invoice", "invoice");

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

// export const subInfoKeyboards;
