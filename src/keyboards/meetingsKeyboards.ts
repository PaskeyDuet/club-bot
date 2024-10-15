import { InlineKeyboard } from "grammy";
import { MeetingsObject } from "../types/shared.types";
import { mainMenu } from "./generalKeyboards";
// import config from "../botConfig/generalConfig";

export const generateMeetingsKeyboard = (
  meetings: MeetingsObject[]
): InlineKeyboard => {
  const keyboard = new InlineKeyboard();
  meetings.forEach((el, inx) => {
    const date = el.date.replace(/202.*$/, "");
    const keyboardText = `${inx + 1}. ${date} - ${el.topic}`;
    keyboard.text(keyboardText, `reg_for_meeting_${el.meetingId}`).row();
  });
  return keyboard.text("Главное меню", "main_menu");
};

export const meetingRegApprovedKeyboard = new InlineKeyboard()
  .text("Записаться ещё", "gen__reg_for_meeting")
  .row()
  .text("Главное меню", "main_menu");
