import { Composer } from "grammy";
import subDetailsControllers from "../dbSetup/handlers/subDetailsControllers";
import subscriptionHandler from "../dbSetup/handlers/subscriptionHandler";
import usersController from "../dbSetup/handlers/usersController";
import SubDetails from "../dbSetup/models/SubDetails";
import guardExp from "../helpers/guardExp";
import { subPaymentManaginKeyboard } from "../keyboards/subKeyboards";
import { MyContext } from "../types/grammy.types";
import { admin, bot } from "../bot";

export async function sendSubMessage(ctx: MyContext) {
  const isNewbie = ctx.session.user.isNewbie;

  if (isNewbie) {
    await ctx.conversation.enter("newbieSubConv");
  } else {
    await ctx.conversation.enter("subConv");
  }
}

export async function paymentsManaging(ctx: MyContext) {
  const paidSubs = await usersController.findUsersWithSub({
    sub_status: "paid",
  });
  const subDetails = await subDetailsControllers.getAllButFirstSub();

  const findPrice = (subNum: number) =>
    subDetails.find((el) => el.sub_number === subNum)?.sub_price;

  const usersList = paidSubs
    .map((el, inx) => {
      inx += 1;
      const username = el.username || `${el.first_name} ${el.second_name}`;
      return `${inx}. @${username} - ${findPrice(el.Subscription.sub_number)}\n`;
    })
    .join("");
  let messText = "Жми на кнопку - подтверждай подписки. Или нет.\n";
  messText += usersList;

  await ctx.editMessageText(messText, {
    reply_markup: subPaymentManaginKeyboard(paidSubs),
  });
}

export async function paymentDeclined(ctx: MyContext, userId: number) {
  console.log("declined");

  const subUpdate = subscriptionHandler.updateSubStatus(userId, "unactive");

  await admin.sendMessage(
    userId,
    "Ваш платёж отклонён. Свяжитесь с нашим менеджером @romanovnr"
  );
}

export async function paymentAccepted(ctx: MyContext, userId: number) {
  console.log("accepted");

  const subUpdate = subscriptionHandler.updateSubStatus(userId, "active");

  await admin.sendMessage(userId, "Ваша подписка активирована!");
}
