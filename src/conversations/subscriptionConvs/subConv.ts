import SubDetails from "#root/dbSetup/models/SubDetails.ts";
import subDetailsControllers from "../../dbSetup/handlers/subDetailsControllers";
import subscriptionHandler from "../../dbSetup/handlers/subscriptionController";
import { mainMenu } from "../../keyboards/generalKeyboards";
import { subKeyboard } from "../../keyboards/subKeyboards";
import { MyContext, MyConversation } from "../../types/grammy.types";
import { TextWithInlineKeyboardObj } from "../../types/shared.types";
import waitForSubNumber from "./helpers/waitForSubNumber";

export async function subConv(conversation: MyConversation, ctx: MyContext) {
  const subs = await subDetailsControllers.getAllButFirstSub();
  if (!subs) {
    throw new Error();
  }

  const subChooseMessage = generateSubChoosingMessageParts(subs);
  await ctx.editMessageText(subChooseMessage.text, {
    reply_markup: subChooseMessage.keyboard,
    parse_mode: "HTML",
  });

  await waitForSubNumber(ctx, conversation, subChooseMessage);
  const chosenSubNum = conversation.session.temp.sub_number;
  if (!chosenSubNum) {
    throw new Error("no chosenSubNum in subConv");
  }

  const chosenSub = subs.find(
    (el) => el.dataValues.sub_number === chosenSubNum
  );
  if (!chosenSub) {
    throw new Error("no chosenSub in subConv");
  }

  const subApproveText = generateChosenSubText(chosenSub);
  await ctx.editMessageText(subApproveText, {
    reply_markup: mainMenu,
    parse_mode: "HTML",
  });

  await subscriptionHandler.upgradeSub(
    ctx.userId,
    "pending",
    chosenSub.sub_number
  );
}

const generateChosenSubText = (chosenSub: SubDetails) => {
  let numberChosenText = `Вы выбрали:\n "<b>${chosenSub.sub_name}</b>"\n`;
  numberChosenText += `Для подтверждения подписки переведите ${chosenSub.sub_price}₽ `;
  numberChosenText += `по номеру телефона <code>+70000000000</code> и затем нажмите клавишу "Оплачено".\n`;
  numberChosenText += `Возможность оплатить счёт будет доступна в течение N минут в главном меню`;

  return numberChosenText;
};
const generateSubChoosingMessageParts = (
  subs: SubDetails[]
): TextWithInlineKeyboardObj => {
  let text = "Выберите тип подписки\n\n";
  text += subs
    .map((el) => {
      const data = el.dataValues;
      return `<b>${data.sub_name}</b> - ${data.sub_price}₽`;
    })
    .join("\n");

  const keyboard = subKeyboard(false);

  return { text, keyboard };
};
