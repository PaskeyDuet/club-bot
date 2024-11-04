import { InlineKeyboardMarkup } from "grammy/types";
import UserSubscription from "../dbSetup/models/UserSubscription";
import User from "../dbSetup/models/User";
import { SubDetailsType } from "../dbSetup/models/SubDetails";
import MeetingsDetails from "#db/models/MeetingsDetails.ts";

export type TextWithInlineKeyboardObj = {
  text: string;
  keyboard?: InlineKeyboardMarkup;
};

export type MeetingObject = {
  place: string;
  topic: string;
  date: string | DbDateType;
};

export type MeetingObjectWithId = MeetingObject & {
  meetingId: number;
};

export type MeetingObjectWithUserCountType = MeetingObjectWithId & {
  userCount: number;
};

export type MeetingsWithDetailsObject = MeetingObjectWithId & {
  user_id: number;
};
export type DbDateType = `${number}-${number}-${number} ${number}:${number}`;
export type SubStatusNames = "unactive" | "pending" | "paid" | "active";

export type UserWithSubscriptionPartialType = Partial<User> &
  Partial<UserSubscription>;
export type MeetingsDetailsQueryParamsType = Partial<MeetingsDetails>;
export type SubDetailsPartialType = Partial<SubDetailsType>;
export type UserWithSubscription = User & {
  UserSubscription: UserSubscription;
};

export type infoUnitPathsType = "who" | "where" | "when";

export type loggerLevelsType =
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace";
