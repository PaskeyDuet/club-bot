import subscriptionHandler from "../dbSetup/handlers/subscriptionHandler";
import { mainMenu } from "../keyboards/generalKeyboards";
import { MyContext } from "../types/grammy.types";
import newSubNotif from "./adminSection/newSubNotif";

export default async function (ctx: MyContext) {
  const updateResult = await subscriptionHandler.updateSubStatus(
    ctx.userId,
    "paid"
  );
  console.log("UpdateStatus\n", updateResult);
  let messageText = "Информация передана нашему менеджеру.\n";
  messageText += "Как только мы подтвердим платёж, вам придёт уведомление ";
  messageText += "и станет доступна возможность записаться на занятие";
  await ctx.editMessageText(messageText, { reply_markup: mainMenu });
  await newSubNotif(ctx);
}
