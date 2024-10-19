import { InlineKeyboard } from "grammy";
import {
  MeetingsObject,
  MeetingsWithDetailsObject,
} from "../types/shared.types";
import { mainMenu } from "./generalKeyboards";
// import config from "../botConfig/generalConfig";

export function generateMeetingsKeyboard(
  meetings: (MeetingsObject | MeetingsWithDetailsObject)[]
): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  meetings.forEach((el, inx) => {
    const date = el.date.replace(/202.*$/, "");
    const keyboardText = `${inx + 1}. ${date} - ${el.topic}`;
    const meetingId = el.meetingId;
    const userId = (el as MeetingsWithDetailsObject).user_id; // Проверяем, есть ли user_id

    // Формируем текст кнопки в зависимости от типа действия
    const callbackData = userId
      ? `meeting__manage_${meetingId}_${userId}`
      : `meeting__reg_${meetingId}`;

    keyboard.text(keyboardText, callbackData).row();
  });
  return keyboard.text("Главное меню", "main_menu");
}

export const cancelMeetingRegApproveKeyboard = (
  meetingId: number,
  userId: number
) =>
  new InlineKeyboard().text(
    "Отменить регистрацию",
    `meeting__cancel_${meetingId}_${userId}`
  );

export const meetingRegApprovedKeyboard = new InlineKeyboard()
  .text("Записаться ещё", "gen__meeting__reg")
  .row()
  .text("Главное меню", "main_menu");
