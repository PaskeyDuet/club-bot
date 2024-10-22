import subDetailsControllers from "#root/dbSetup/handlers/subDetailsControllers.ts";
import usersController from "#root/dbSetup/handlers/usersController.ts";
import SubDetails from "#root/dbSetup/models/SubDetails.ts";
import { subPaymentManaginKeyboard } from "#root/keyboards/subKeyboards.ts";
import { MyContext, MyConversation } from "#root/types/grammy.types.ts";
import {
  TextWithInlineKeyboardObj,
  UserWithSubscription,
} from "#root/types/shared.types.ts";

export async function paymentsManaging(
  conversation: MyConversation,
  ctx: MyContext
) {
  const paidSubs = await usersController.findUsersWithSub({
    sub_status: "paid",
  });
  const subDetails = await subDetailsControllers.getAllButFirstSub();
  if (!paidSubs || !subDetails) {
    throw new Error();
  }

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
      inx += 1;
      const username = el.username || `${el.first_name} ${el.second_name}`;
      return `${inx}. @${username} - ${subPrice}\n`;
    })
    .join("");
};
