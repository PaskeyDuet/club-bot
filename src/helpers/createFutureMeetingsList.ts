import { MeetingsObject } from "../types/shared.types";

export default (meetings: MeetingsObject[]): string => {
  return meetings
    .map((el) => `📅 ${el.date}\n🗒 ${el.topic}\n📍 ${el.place}\n`)
    .join("\n");
};
