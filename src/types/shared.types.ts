import { InlineKeyboardMarkup } from "grammy/types";
import UserSubscription from "../dbSetup/models/UserSubscription";
import User from "../dbSetup/models/User";
import { SubDetailsType } from "../dbSetup/models/SubDetails";

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
export type SubStatusNames = "unactive" | "pending" | "paid" | "active";

export type UserWithSubscriptionPartialType = Partial<User> &
  Partial<UserSubscription>;
export type SubDetailsPartialType = Partial<SubDetailsType>;
export type UserWithSubscription = User & {
  UserSubscription: UserSubscription;
};

export type loggerLevelsType =
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace";
