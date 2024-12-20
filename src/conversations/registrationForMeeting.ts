import {
  meetingsController,
  meetingsDetailsController,
} from "#db/handlers/index.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import {
  createMeetingsList,
  getFutureMeetings,
  guardExp,
} from "#helpers/index.js";
import {
  mainMenu,
  generateMeetingsKeyboard,
  meetingRegApprovedKeyboard,
} from "#keyboards/index.js";
import type {
  MeetingObject,
  MeetingObjectWithId,
  TextWithInlineKeyboardObj,
} from "#types/shared.types.js";
import chooseMeetingNumber from "#conv/helpers/regForMeeting/chooseMeetingNumber.js";
import userFilteredMeetings from "#conv/helpers/regForMeeting/userFilteredMeetings.js";
import type { MyContext, MyConversation } from "#types/grammy.types.js";
import type { InlineKeyboard } from "grammy";

export async function registrationForMeeting(
  conversation: MyConversation,
  ctx: MyContext
) {
  try {
    const futureMeetingsWithUsers =
      await meetingsController.futureMeetingsWithUsers(ctx.userId);
    const futureMeetings = await getFutureMeetings();

    guardExp(futureMeetings, "futureMeetings inside regForMeeting");
    guardExp(
      futureMeetingsWithUsers,
      "futureMeetingsWithUsers inside regForMeeting"
    );

    const availableRegs = userFilteredMeetings(
      futureMeetings,
      futureMeetingsWithUsers
    );

    const baseMess = baseMessObj(availableRegs);
    await ctx.editMessageText(baseMess.text, {
      reply_markup: baseMess.keyboard,
    });

    await chooseMeetingNumber(conversation, ctx, baseMess);
    const meetingId = conversation.session.temp.meetingNumber;
    guardExp(meetingId, "meetingId inside regForMeeting");

    await meetingsDetailsController.addUserToMeet(ctx.userId, meetingId);
    const currMeeting = futureMeetings.find((el) => el.meetingId === meetingId);
    guardExp(currMeeting, "currMeeting inside regForMeeting");

    const isNewbie = ctx.session.user.isNewbie;
    const finalMessage = finalMessObj(currMeeting, isNewbie);
    await ctx.editMessageText(finalMessage.text, {
      reply_markup: finalMessage.keyboard,
      parse_mode: "HTML",
    });
  } catch (err) {
    logErrorAndThrow(err, "fatal", "Can't registrate a user for a meeting");
  }
}

const baseMessObj = (
  availableRegs: MeetingObjectWithId[]
): TextWithInlineKeyboardObj => {
  let text = "";
  let keyboard: InlineKeyboard;
  if (availableRegs.length !== 0) {
    text += "На данный момент для записи ";
    text += "доступны следующие встречи:\n\n";
    text += createMeetingsList.userView(availableRegs);
    text += "\nВыберите ту, на которую ";
    text += "вы хотели бы записаться, нажав на кнопку ниже👇🏻";
    keyboard = generateMeetingsKeyboard(availableRegs, false);
  } else {
    text = "На данный момент нет доступных встреч. Зайдите позже";
    keyboard = mainMenu;
  }

  return {
    text,
    keyboard,
  };
};

const finalMessObj = (
  currMeeting: MeetingObject,
  isNewbie: boolean
): TextWithInlineKeyboardObj => {
  let text = "";
  text += `Вы успешно зарегистрировались на занятие по теме <b>${currMeeting.topic}</b> `;
  text += `которое пройдет <b>${currMeeting.date}</b> в <b>${currMeeting.place}</b>\n\n`;
  text += "Вы можете проверить список ваших текущих записей в главном меню\n";
  text += "Мы оповестим вас о посещении за день до встречи";
  const keyboard = meetingRegApprovedKeyboard(isNewbie);
  return { text, keyboard };
};
