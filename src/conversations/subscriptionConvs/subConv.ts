import subDetailsControllers from "../../dbSetup/handlers/subDetailsControllers";
import subscriptionHandler from "../../dbSetup/handlers/subscriptionHandler";
import { mainMenu } from "../../keyboards/generalKeyboards";
import { subKeyboard, waitForPayKeyboard } from "../../keyboards/subKeyboards";
import { MyContext, MyConversation } from "../../types/grammy.types";
import { TextWithInlineKeyboardObj } from "../../types/shared.types";
import waitForSubNumber from "./helpers/waitForSubNumber";

export async function subConv(conversation: MyConversation, ctx: MyContext) {
  const subs = await subDetailsControllers.getAllButFirstSub();

  const messageData: TextWithInlineKeyboardObj = {
    text: "",
    keyboard: subKeyboard(false),
  };
  messageData.text += "Выберите тип подписки\n\n";
  subs.forEach((el) => {
    const data = el.dataValues;
    messageData.text += `<b>${data.sub_name}</b> - ${data.sub_price}₽\n`;
  });

  await ctx.editMessageText(messageData.text, {
    reply_markup: subKeyboard(false),
    parse_mode: "HTML",
  });
  await waitForSubNumber(ctx, conversation, messageData);
  const chosenNum = conversation.session.temp.sub_number;
  console.log(chosenNum);

  const chosenSub = subs.filter(
    (el) => el.dataValues.sub_number === chosenNum
  )[0];

  let numberChosenText = `Вы выбрали:\n "<b>${chosenSub.sub_name}</b>"\n`;
  numberChosenText += `Для подтверждения подписки переведите ${chosenSub.sub_price}₽ `;
  numberChosenText += `по номеру телефона <code>+70000000000</code> и затем нажмите клавишу "Оплачено".\n`;
  numberChosenText += `Возможность оплатить счёт будет доступна в течение N минут в главном меню`;

  await ctx.editMessageText(numberChosenText, {
    reply_markup: mainMenu,
    parse_mode: "HTML",
  });
  await subscriptionHandler.updateSub(
    ctx.userId,
    "pending",
    chosenSub.sub_number
  );
}
