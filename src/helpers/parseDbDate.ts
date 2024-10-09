import { dateObj } from "../types/shared.types";

export const meetingDateParser = (date: Date | string): dateObj => {
  if (date instanceof Date) {
    return {
      day: date.getUTCDate(),
      month: date.getUTCMonth().toLocaleString(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
  } else {
    throw new Error("Wrong date");
  }
};
