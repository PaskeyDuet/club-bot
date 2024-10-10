import meetingsController from "../dbSetup/handlers/meetingsController";
import { MeetingsObject } from "../types/shared.types";
import { meetingDateParser } from "./parseDbDate";

export default async function (): Promise<MeetingsObject[]> {
  try {
    const allMeetings = await meetingsController.futureMeetings();
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
    console.error("Error fetching future meetings:", error);
    throw new Error("Unable to fetch meetings");
  }
}
