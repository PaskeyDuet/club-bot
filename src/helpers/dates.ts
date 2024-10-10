import moment from "moment-timezone";
import { DbDateType } from "../types/shared.types";

export default {
  currDate: () => new Date(),
  dateFromString: (dateStr: DbDateType) => new Date(dateStr),
};
