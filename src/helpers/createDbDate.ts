import moment from "moment-timezone";
import { DbDateType } from "../types/shared.types";

export default {
  currDate: () =>
    new Date(moment().tz("Europe/Moscow").format("YYYY-MM-DD HH:mm")),
  dateFromString: (dateStr: DbDateType) => {
    const moscowTime = moment.tz(dateStr, "Europe/Moscow");
    return new Date(dateStr).toString();
  },
};
