interface User {
  fio: string;
  isNewbie: boolean;
}
export type dateObj = {
  day?: number;
  month?: string;
  hours?: number;
  minutes?: number;
};
export type MeetingsObject = {
  meetingId: number;
  place: string;
  topic: string;
  date: dateObj;
};
export type DbDateType = `${number}-${number}-${number} ${number}:${number}`;
