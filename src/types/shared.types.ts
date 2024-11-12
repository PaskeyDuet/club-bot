import type UserSubscription from "#db/models/UserSubscription.js";
import type User from "#db/models/User.js";
import type { SubDetailsType } from "#db/models/SubDetails.js";
import type MeetingsDetails from "#db/models/MeetingsDetails.js";
import type { InlineKeyboardMarkup } from "grammy/types";

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
