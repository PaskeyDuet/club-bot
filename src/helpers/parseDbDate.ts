import moment from "moment-timezone";

export const meetingDateParser = (date: Date | string): string => {
  return moment(date).locale("ru").format("LLL");
};
