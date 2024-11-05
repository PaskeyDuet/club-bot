import { InlineKeyboard } from "grammy";
import { UserWithSubscription } from "types/shared.types";

const subKeyboard = (newbie: boolean) => {
  const k = new InlineKeyboard();
  if (newbie) {
    k.text("Записаться", "gen__meeting__reg").row();
  } else {
    k.text("Месячная подписка", "sub_second")
      .row()
      .text("Трехмесячная подписка", "sub_third")
      .row()
      .text("Годовая подписка", "sub_fourth")
      .row();
  }
  return k.text("Главное меню", "back");
};

const waitForPayKeyboard = new InlineKeyboard()
  .text("Оплачено", "sub_paid")
  .row()
  .text("Отменить оплату", "sub_cancel");

const subPaymentManaginKeyboard = (paidSubs: UserWithSubscription[]) => {
  const k = new InlineKeyboard();
  if (paidSubs.length > 0) {
    paidSubs.forEach((user, inx) => {
      inx += 1;
      k.text(`${inx}. Decline`, `sub_decline_${user.user_id}`);
      k.text(`${inx}. Accept`, `sub_accept_${user.user_id}`).row();
    });
  } else {
    k.text("Admin menu", "gen__admin");
  }

  return k;
};

export { subKeyboard, waitForPayKeyboard, subPaymentManaginKeyboard };
