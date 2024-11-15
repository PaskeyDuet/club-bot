import { Op, type Transaction } from "sequelize";
import Meetings, { type MeetingsCreationType } from "../models/Meetings.js";
import MeetingsDetails from "../models/MeetingsDetails.js";
import { dates } from "#helpers/index.js";
import type { MeetingsWithDetailsObject } from "#types/shared.types.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";

export default {
  allMeetings: async () => {
    try {
      return await Meetings.findAll();
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. meetingsController error: allMeetings unavailable"
      );
    }
  },
  findMeeting: async (meetingId: number) => {
    return await Meetings.findOne({ where: { meeting_id: meetingId } });
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
      const adminMode = !!userId;
      const meetings = await Meetings.findAll({
        where: { date: { [Op.gt]: dates.currDate() } },
        include: {
          model: MeetingsDetails,
          required: adminMode, // Изменено на false, чтобы получать встречи даже без пользователей
          where: { user_id: userId || { [Op.ne]: null } },
        },
      });

      return meetings.map((el) => {
        const dv = el.dataValues;
        const details = dv.MeetingsDetails
          ? dv.MeetingsDetails[0]?.dataValues
          : null;

        // Формируем объект с данными о встрече
        const obj: MeetingsWithDetailsObject = {
          meetingId: dv.meeting_id,
          place: dv.place,
          topic: dv.topic,
          date: dates.meetingDateParser(dv.date),
          user_id: details?.user_id || null, // user_id будет null, если данных нет
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
  createMeeting: async (
    meeting: MeetingsCreationType,
    transaction: Transaction
  ) => {
    try {
      return await Meetings.create(meeting, { transaction });
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. meetingsController error: createMeeting unavailable"
      );
    }
  },
  deleteMeeting: async (meetingId: number) =>
    await Meetings.destroy({ where: { meeting_id: meetingId } }),
};
