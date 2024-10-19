import { InlineKeyboard } from "grammy";

//TODO: Если подписка есть, не добавлять кнопку
//TODO: Если человек зашёл не в первый раз, вместо куда я попал добавлять ИНФО кнопку
export function greetingKeyboard(
  newbie: boolean,
  subscribed: boolean,
  paidStatus: boolean
) {
  const keyboard = new InlineKeyboard();
  if (newbie) {
    keyboard
      .text("Куда я попал?", "gen__info")
      .row()
      .text("Попасть на занятие", "gen__meeting__reg_newbie")
      .row();
  } else if (subscribed) {
    keyboard
      .text("Инфо", "gen__info")
      .row()
      .text("Записаться на занятие", "gen__meeting__reg")
      .row();
  } else if (paidStatus) {
    keyboard.text("Инфо", "gen__info").row();
  } else {
    keyboard
      .text("Инфо", "gen__info")
      .row()
      .text("Оформить подписку", "gen__create_sub")
      .row();
  }
  keyboard.text("Расписание", "gen__schedule");
  return keyboard;
}
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

export const adminMenuKeyboard = (newSubs: boolean) => {
  const k = new InlineKeyboard();
  if (newSubs) {
    return k.text("Активировать подписки", "sub_manage");
  } else {
    return k.text("пусто");
  }
};
