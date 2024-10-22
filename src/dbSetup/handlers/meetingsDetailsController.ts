import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";
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
};
