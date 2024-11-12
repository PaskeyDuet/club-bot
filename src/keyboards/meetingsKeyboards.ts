import { InlineKeyboard } from "grammy";
import type {
  MeetingObjectWithId,
  MeetingsWithDetailsObject,
} from "types/shared.types.js";

// import config from "../botConfig/generalConfig";

const generateMeetingsKeyboard = (
  meetings: MeetingsWithDetailsObject[],
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
  }
  return keyboardWithMeetings.text("Главное меню", "main_menu");
};

const meetingButtonsIterator = (
  keyboard: InlineKeyboard,
  meetings: MeetingsWithDetailsObject[],
  adminMode: boolean
) => {
  meetings.forEach((el, inx) => {
    el.date.replace(/202.*$/, "");
    const keyboardText = `${inx + 1}. ${el.date} - ${el.topic}`;
    const meetingId = el.meetingId;
    const userId = el.user_id; // Проверяем, есть ли user_id

    // Формируем текст кнопки в зависимости от типа действия
    let callbackData: string;
    if (adminMode) {
      callbackData = `meeting__control_${meetingId}`;
    } else {
      callbackData = userId
        ? `meeting__manage_${meetingId}_${userId}`
        : `meeting__reg_${meetingId}`;
    }
    console.log(callbackData);

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

const adminManageMeeting = (meetingId: number) =>
  new InlineKeyboard()
    .text("Отменить встречу", `meeting__admin-cancel_${meetingId}`)
    .row()
    .text("Назад", "back");

const userManageMeeting = (meetingId: number, userId: number) =>
  new InlineKeyboard()
    .text("Открыть словарь", `meeting__open-dictionary_${meetingId}`)
    .row()
    .text("Отменить запись", `meeting__cancel_${meetingId}_${userId}`)
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

const meetingVisitNotificationKeyboard = (
  meetingId: number,
  userId: number
) => {
  return new InlineKeyboard()
    .text("Меня не будет", `meeting__cancel_${meetingId}_${userId}`)
    .text("Я буду!", "meeting__confirm-visit");
};
export {
  meetingCreatedMenu,
  meetingCreateCheckKeyboard,
  meetingRegApprovedKeyboard,
  generateMeetingsKeyboard,
  cancelMeetingRegApproveKeyboard,
  adminManageMeeting,
  meetingVisitNotificationKeyboard,
  userManageMeeting,
};
