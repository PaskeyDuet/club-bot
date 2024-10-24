import { Op } from "sequelize";
import Meetings from "../models/Meetings";
import dates from "../../helpers/dates";
import MeetingsDetails from "../models/MeetingsDetails";
import { MeetingsWithDetailsObject } from "../../types/shared.types";
import { meetingDateParser } from "../../helpers/parseDbDate";
import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";

export default {
  allMeetings: async () => {
    try {
      await Meetings.findAll();
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. meetingsController error: allMeetings unavailable"
      );
    }
  },
  futureMeetings: async () => {
    try {
      return await Meetings.findAll({
        where: { date: { [Op.gt]: dates.currDate() } },
      });
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. meetingsController error: futureMeetings unavailable"
      );
    }
  },
  futureMeetingsWithUsers: async (userId?: number) => {
    try {
      const meetings = await Meetings.findAll({
        where: { date: { [Op.gt]: dates.currDate() } },
        include: {
          model: MeetingsDetails,
          required: true,
          where: { user_id: userId || { [Op.ne]: null } },
        },
      });

      return meetings.map((el) => {
        const dv = el.dataValues;
        if (!dv.MeetingsDetails) {
          throw new Error("There is no meetingDetails");
        }
        const detailsDv = dv.MeetingsDetails[0].dataValues;
        const obj: MeetingsWithDetailsObject = {
          meetingId: dv.meeting_id,
          place: dv.place,
          topic: dv.topic,
          date: meetingDateParser(dv.date),
          user_id: detailsDv.user_id,
        };
        return obj;
      });
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. meetingsController error: futureMeetingsWithUsers unavailable"
      );
    }
  },
};
