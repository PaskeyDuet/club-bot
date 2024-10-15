import meetingsController from "../dbSetup/handlers/meetingsController";
import meetingsDetailsController from "../dbSetup/handlers/meetingsDetailsController";
import createFutureMeetingsList from "../helpers/createFutureMeetingsList";
import getFutureMeetings from "../helpers/getFutureMeetings";
import { mainMenu } from "../keyboards/generalKeyboards";
import {
  generateMeetingsKeyboard,
  meetingRegApprovedKeyboard,
} from "../keyboards/meetingsKeyboards";
import { MyContext, MyConversation } from "../types/grammy.types";
import { TextWithInlineKeyboardObj } from "../types/shared.types";
import chooseMeetingNumber from "./helpers/regForMeeting/chooseMeetingNumber";
import userFilteredMeetings from "./helpers/regForMeeting/userFilteredMeetings";

//TODO: В дальнейшем необходимо добавить условие "Человек - новичок"
export async function registrationForMeeting(
  conversation: MyConversation,
  ctx: MyContext
) {
  const futureMeetingsWithUsers =
    await meetingsController.futureMeetingsWithUsers();
  const futureMeetings = await getFutureMeetings();

  const availableRegs = userFilteredMeetings(
    futureMeetings,
    futureMeetingsWithUsers
  );

  const messageData: TextWithInlineKeyboardObj = {
    text: "",
  };
  if (availableRegs.length !== 0) {
    messageData.text +=
      "На данный момент для записи доступны следующие встречи:\n\n";
    messageData.text += createFutureMeetingsList(availableRegs);
    messageData.text +=
      "\nВыберите ту, на которую вы хотели бы записаться, нажав на кнопку ниже👇🏻";
    messageData.keyboard = generateMeetingsKeyboard(availableRegs);
  } else {
    //TODO: Подписка на уведомления о новых встречах
    messageData.text += "На данный момент нет доступных встреч. Зайдите позже";
    messageData.keyboard = mainMenu;
  }

  await ctx.editMessageText(messageData.text, {
    reply_markup: messageData.keyboard,
  });

  await chooseMeetingNumber(conversation, ctx, messageData);

  const meetingId = conversation.session.temp.meetingNumber;

  if (meetingId) {
    await meetingsDetailsController.addUserToMeet(ctx.userId, meetingId);

    const currMeeting = futureMeetings.filter(
      (el) => el.meetingId === meetingId
    )[0];

    let finalMessage = "";
    finalMessage += `Вы успешно зарегистрировались на занятие по теме <b>${currMeeting.topic}</b> `;
    finalMessage += `которая пройдет <b>${currMeeting.date}</b> в <b>${currMeeting.place}</b>\n\n`;
    finalMessage += `Вы можете проверить список ваших текущих записей в главном меню\n`;
    finalMessage += `Мы оповестим вас о посещении за день до встречи`;
    await ctx.editMessageText(finalMessage, {
      reply_markup: meetingRegApprovedKeyboard,
      parse_mode: "HTML",
    });
  }
}
