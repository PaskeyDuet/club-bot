import { Op } from "sequelize";
import Meetings from "../models/Meetings";
import dates from "../../helpers/dates";
import MeetingsDetails from "../models/MeetingsDetails";
import { MeetingsWithDetailsObject } from "../../types/shared.types";
import { meetingDateParser } from "../../helpers/parseDbDate";

export default {
  allMeetings: () => Meetings.findAll(),
  futureMeetings: () => {
    return Meetings.findAll({
      where: { date: { [Op.gt]: dates.currDate() } },
    });
  },
  futureMeetingsWithUsers: async () => {
    const meetings = await Meetings.findAll({
      where: { date: { [Op.gt]: dates.currDate() } },
      include: {
        model: MeetingsDetails,
        required: true,
      },
    });

    return meetings.map((el) => {
      const dv = el.dataValues;
      if (dv.MeetingsDetails) {
        const detailsDv = dv.MeetingsDetails[0].dataValues;
        const obj: MeetingsWithDetailsObject = {
          meetingId: dv.meeting_id,
          place: dv.place,
          topic: dv.topic,
          date: meetingDateParser(dv.date),
          user_id: detailsDv.user_id,
        };
        return obj;
      } else {
        throw new Error("There is no meetingDetails");
      }
    });
  },
};
