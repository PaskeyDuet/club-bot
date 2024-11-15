import { InlineKeyboard } from "grammy";
function greetingKeyboard(
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
  keyboard
    .text("Расписание", "gen__schedule")
    .row()
    .text("Мой профиль", "gen__profile");
  return keyboard;
}
const infoKeyboards = {
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

const mainMenu = new InlineKeyboard().text("Главное меню", "main_menu");

const adminMenuKeyboard = (newSubs: boolean) => {
  const k = new InlineKeyboard();
  if (newSubs) {
    k.text("Активировать подписки", "sub_manage").row();
  }
  k.text("Создать встречу", "meeting__create").row();
  k.text("Посмотреть текущие встречи", "meeting__schedule");

  return k;
};

const adminMenu = new InlineKeyboard().text("Меню", "gen__admin");
const backButton = new InlineKeyboard().text("Назад", "back");
export {
  greetingKeyboard,
  infoKeyboards,
  mainMenu,
  adminMenuKeyboard,
  adminMenu,
  backButton,
};
