import { InlineKeyboard } from "grammy";

export function subKeyboard(newbie: boolean) {
  const k = new InlineKeyboard();
  if (newbie) {
    k.text("Записаться", "gen__reg_for_meeting").row();
  } else {
    k.text("Месячная подписка", "sub_first")
      .row()
      .text("Трехмесячная подписка", "sub_second")
      .row()
      .text("Годовая подписка", "sub_third")
      .row();
  }
  return k.text("Главное меню", "back");
}
