import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import { MeetingsDetailsQueryParamsType } from "#types/shared.types.js";
import MeetingsDetails from "../models/MeetingsDetails";

export default {
  findAll: async () => {
    try {
      await MeetingsDetails.findAll();
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. meetingsDetailsController error: findAll unavailable"
      );
    }
  },
  findAllByQuery: async (query: MeetingsDetailsQueryParamsType) => {
    return await MeetingsDetails.findAll({ where: query });
  },
  addUserToMeet: async (userId: number, meetingId: number) => {
    try {
      return await MeetingsDetails.create({
        user_id: userId,
        meeting_id: meetingId,
      });
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. meetingsDetailsController error: addUserToMeet unavailable"
      );
    }
  },
  destroyUserReg: async (meetingId: number, userId: number) => {
    try {
      return await MeetingsDetails.destroy({
        where: { user_id: userId, meeting_id: meetingId },
      });
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. meetingsDetailsController error: destroyUserReg unavailable"
      );
    }
  },
  destroyUserRegs: async (userIds: number[]) => {
    const delOperations = userIds.map((el) =>
      MeetingsDetails.destroy({ where: { user_id: el } })
    );
    return await Promise.all(delOperations);
  },
};
