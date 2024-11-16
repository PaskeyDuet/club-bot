import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import type { MeetingsDetailsQueryParamsType } from "#types/shared.types.js";
import type { FindOptions, Transaction } from "sequelize";
import MeetingsDetails, {
  type MeetingsDetailsType,
} from "../models/MeetingsDetails.js";

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
  findAllByQuery: async (
    query: MeetingsDetailsQueryParamsType,
    options?: FindOptions<MeetingsDetailsType>,
    transaction?: Transaction
  ) => {
    return await MeetingsDetails.findAll({ where: query, ...options });
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
