import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";
import meetingsController from "../dbSetup/handlers/meetingsController";
import { MeetingsObject } from "../types/shared.types";
import { meetingDateParser } from "./parseDbDate";

export default async function (): Promise<MeetingsObject[] | undefined> {
  try {
    const allMeetings = await meetingsController.futureMeetings();
    if (!allMeetings) {
      throw new Error();
    }
    return allMeetings.map((meeting) => {
      const dv = meeting.dataValues;
      const dateDetails: string = meetingDateParser(dv.date);
      return {
        meetingId: dv.meeting_id,
        place: dv.place,
        topic: dv.topic,
        date: dateDetails,
      };
    });
  } catch (error) {
    logErrorAndThrow(error, "fatal", "Error fetching future meetings");
  }
}
