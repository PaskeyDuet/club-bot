import meetingsDetailsController from "../dbSetup/handlers/meetingsDetailsController";
import createFutureMeetingsList from "../helpers/createFutureMeetingsList";
import getFutureMeetings from "../helpers/getFutureMeetings";
import { mainMenu } from "../keyboards/generalKeyboards";
import { generateMeetingsKeyboard } from "../keyboards/meetingsKeyboards";
import { MyContext, MyConversation } from "../types/grammy.types";
import { TextWithInlineKeyboardObj } from "../types/shared.types";
import chooseMeetingNumber from "./helpers/chooseMeetingNumber";
import unlessActions from "./helpers/unlessActions";

export async function registrationForMeeting(
  conversation: MyConversation,
  ctx: MyContext
) {
  console.log(ctx.userId);

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

  const { callbackQuery: cbQ } = await chooseMeetingNumber(
    conversation,
    ctx,
    messageData
  );
  const meetingId = cbQ.data.split("reg_for_meeting_")[1];
  const createdVisit = await meetingsDetailsController.addUserToMeet(
    ctx.userId,
    parseInt(meetingId)
  );
  console.log(createdVisit);
}
