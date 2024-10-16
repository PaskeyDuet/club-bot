import { InlineKeyboardMarkup } from "grammy/types";

export type TextWithInlineKeyboardObj = {
  text: string;
  keyboard?: InlineKeyboardMarkup;
};
export type MeetingsObject = {
  meetingId: number;
  place: string;
  topic: string;
  date: string;
};
export type MeetingsWithDetailsObject = MeetingsObject & {
  user_id: number;
};
export type DbDateType = `${number}-${number}-${number} ${number}:${number}`;
export type SubStatusNames = "unactive" | "pending" | "active";
