import createFutureMeetingsList from "../helpers/createFutureMeetingsList";
import getFutureMeetings from "../helpers/getFutureMeetings";
import { mainMenu } from "../keyboards/generalKeyboards";
import { generateMeetingsKeyboard } from "../keyboards/meetingsKeyboards";
import { MyContext, MyConversation } from "../types/grammy.types";
import { TextWithInlineKeyboardObj } from "../types/shared.types";

export async function registrationForMeeting(
  conversation: MyConversation,
  ctx: MyContext
) {
  const futureMeetings = await getFutureMeetings();
  const messageData: TextWithInlineKeyboardObj = {
    text: "",
  };
  if (futureMeetings.length !== 0) {
    messageData.text +=
      "На данный момент для записи доступны следующие встречи:\n\n";
    messageData.text += createFutureMeetingsList(futureMeetings);
    messageData.text +=
      "\nВыберите ту, на которую вы хотели бы записаться, нажав на кнопку ниже👇🏻";
    messageData.keyboard = generateMeetingsKeyboard(futureMeetings);
  } else {
    //TODO: Подписка на уведомления о новых встречах
    messageData.text += "На данный момент нет доступных встреч. Зайдите позже";
    messageData.keyboard = mainMenu;
  }

  await ctx.editMessageText(messageData.text, {
    reply_markup: messageData.keyboard,
  });

  const s = await conversation.waitForCallbackQuery(/reg_for_meeting/, {
    otherwise: () => console.log("s"),
  });
}
