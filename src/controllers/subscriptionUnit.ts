import { Composer } from "grammy";
import subDetailsControllers from "../dbSetup/handlers/subDetailsControllers";
import subscriptionHandler from "../dbSetup/handlers/subscriptionController";
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

export async function paymentManage(
  ctx: MyContext,
  userId: number,
  status: "unactive" | "active"
) {
  await subscriptionHandler.updateSubStatus(userId, status);
  let messText = "";
  switch (status) {
    case "active":
      messText += "Ваша подписка активирована!";
      break;
    case "unactive":
      messText +=
        "Ваш платёж отклонён. Свяжитесь с нашим менеджером @romanovnr";
      break;
  }
  await admin.sendMessage(userId, messText);
}
