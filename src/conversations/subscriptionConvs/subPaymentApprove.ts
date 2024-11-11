import { usersController, subDetailsControllers } from "#db/handlers/index.js";
import type SubDetails from "#db/models/SubDetails.js";
import { guardExp } from "#helpers/index.js";
import { subPaymentManaginKeyboard } from "#keyboards/index.js";
import type { MyContext, MyConversation } from "#types/grammy.types.js";
import type { UserWithSubscription } from "#types/shared.types.js";
const findSubPrice = (subDetails: SubDetails[], subNum: number) => {
  return subDetails.find((el) => el.sub_number === subNum)?.sub_price;
};
const usersListGenerator = (
  paidSubs: UserWithSubscription[],
  subDetails: SubDetails[]
) => {
  return paidSubs
    .map((el, inx) => {
      const subPrice = findSubPrice(subDetails, el.UserSubscription.sub_number);
      const username = el.username || `${el.first_name} ${el.second_name}`;
      return `${inx + 1}. @${username} - ${subPrice}\n`;
    })
    .join("");
};
export async function paymentsManaging(
  conversation: MyConversation,
  ctx: MyContext
) {
  const paidSubs = await usersController.findUsersWithSub({
    sub_status: "paid",
  });
  const subDetails = await subDetailsControllers.getAllButFirstSub();

  guardExp(paidSubs, "paidSubs inside subPaymentApprove");
  guardExp(subDetails, "paidSubs inside subPaymentApprove");

  let messText = "";
  if (paidSubs.length > 0) {
    messText += usersListGenerator(paidSubs, subDetails);
    messText += "Жми на кнопку - подтверждай подписки. Или нет.\n";
  } else {
    messText += "Новых подписок не найдено.";
  }
  await ctx.editMessageText(messText, {
    reply_markup: subPaymentManaginKeyboard(paidSubs),
  });
}
