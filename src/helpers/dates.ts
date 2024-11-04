import moment from "moment-timezone";
import { DbDateType } from "#root/types/shared.types.ts";

export default {
  currDate: () => new Date(),
  dateFromString: (dateStr: DbDateType) => new Date(dateStr),
  meetingDateParser: (date: Date | string) => {
    return moment(date)
      .locale("ru")
      .format("LLL")
      .replace(/ 202. г\./, "");
  },
  meetingDateFromString: (dateStr: string) => {
    const format = "DD.MM.YY, HH:mm";
    const date = moment(dateStr, format);

    return date.toDate();
  },
  isDatePassed(dateToCheck: Date) {
    const currDate = this.currDate();
    return currDate > dateToCheck;
  },
};
