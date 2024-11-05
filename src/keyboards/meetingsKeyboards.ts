import { InlineKeyboard } from "grammy";
import {
  MeetingObjectWithId,
  MeetingsWithDetailsObject,
} from "types/shared.types";

// import config from "../botConfig/generalConfig";

const generateMeetingsKeyboard = (
  meetings: (MeetingObjectWithId | MeetingsWithDetailsObject)[],
  adminMode: boolean
): InlineKeyboard => {
  const keyboard = new InlineKeyboard();
  const keyboardWithMeetings = meetingButtonsIterator(
    keyboard,
    meetings,
    adminMode
  );
  if (adminMode) {
    return keyboardWithMeetings.text("Главное меню", "gen__admin");
  } else {
    return keyboardWithMeetings.text("Главное меню", "main_menu");
  }
};

const meetingButtonsIterator = (
  keyboard: InlineKeyboard,
  meetings: (MeetingObjectWithId | MeetingsWithDetailsObject)[],
  adminMode: boolean
) => {
  meetings.forEach((el, inx) => {
    el.date.replace(/202.*$/, "");
    const keyboardText = `${inx + 1}. ${el.date} - ${el.topic}`;
    const meetingId = el.meetingId;
    const userId = (el as MeetingsWithDetailsObject).user_id; // Проверяем, есть ли user_id

    // Формируем текст кнопки в зависимости от типа действия
    let callbackData;
    if (adminMode) {
      callbackData = `meeting__control_${meetingId}`;
      console.log("callbackData", callbackData);
    } else {
      callbackData = userId
        ? `meeting__cancel_${meetingId}_${userId}`
        : `meeting__reg_${meetingId}`;
    }

    keyboard.text(keyboardText, callbackData).row();
  });
  return keyboard;
};

const cancelMeetingRegApproveKeyboard = (
  meetingId: number,
  userId?: number
) => {
  const k = new InlineKeyboard();
  if (userId) {
    k.text(
      "Отменить регистрацию",
      `meeting__cancel-confirm_${meetingId}_${userId}`
    );
  } else {
    k.text(
      "Отменить встречу",
      `meeting__admin-cancel-confirm_${meetingId}_${userId}`
    );
  }
  return k.row().text("Назад", "back");
};

const manageMeeting = (meetingId: number) =>
  new InlineKeyboard()
    .text("Отменить встречу", `meeting__admin-cancel_${meetingId}`)
    .row()
    .text("Назад", "back");

const meetingRegApprovedKeyboard = (isNewbie: boolean) => {
  const k = new InlineKeyboard();
  if (!isNewbie) {
    k.text("Записаться ещё", "gen__meeting__reg").row();
  }
  return k.text("Главное меню", "main_menu");
};

const meetingCreateCheckKeyboard = new InlineKeyboard()
  .text("No", "meeting__create_reject")
  .text("Yes", "meeting__create_submit")
  .row()
  .text("Главное меню", "gen__admin");

const meetingCreatedMenu = new InlineKeyboard()
  .text("Посмотреть текущие встречи", "meeting__schedule")
  .row()
  .text("Меню", "gen__admin");

export {
  meetingCreatedMenu,
  meetingCreateCheckKeyboard,
  meetingRegApprovedKeyboard,
  generateMeetingsKeyboard,
  cancelMeetingRegApproveKeyboard,
  manageMeeting,
};
