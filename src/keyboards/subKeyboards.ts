import { InlineKeyboard } from "grammy";

export function subKeyboard(newbie: boolean) {
  const k = new InlineKeyboard();
  if (newbie) {
    k.text("Записаться", "gen__reg_for_meeting").row();
  } else {
    k.text("Месячная подписка", "sub_second")
      .row()
      .text("Трехмесячная подписка", "sub_third")
      .row()
      .text("Годовая подписка", "sub_fourth")
      .row();
  }
  return k.text("Главное меню", "back");
}
export const waitForPayKeyboard = new InlineKeyboard()
  .text("Оплачено", "sub_paid")
  .row()
  .text("Отменить оплату", "sub_payment_cancel");
