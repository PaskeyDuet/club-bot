import meetingsController from "../dbSetup/handlers/meetingsController";
import { dateObj, MeetingsObject } from "../types/shared.types";
import { meetingDateParser } from "./parseDbDate";

export default async () => {
  //Лучше сделать отдельный модуль, который возвращает объекты встреч тк он понадобится и для клавиатуры
  const allMeetings = await meetingsController.futureMeetings();
  const meetingObjects: MeetingsObject[] = allMeetings.map((meeting) => {
    const dv = meeting.dataValues;
    const dateDetails: dateObj = meetingDateParser(dv.date);
    return {
      meetingId: dv.meeting_id,
      place: dv.place,
      topic: dv.topic,
      date: dateDetails,
    };
  });
};
