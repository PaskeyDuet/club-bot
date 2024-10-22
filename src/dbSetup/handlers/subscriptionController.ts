import handleError from "#handlers/logErrorAndThrow.ts";
import {
  SubStatusNames,
  UserWithSubscriptionPartialType,
} from "#root/types/shared.types.ts";
import UserSubscription from "../models/UserSubscription";

export default {
  findSub: async (userId: number) => {
    if (!userId) throw new Error("Invalid userId");
    try {
      return await UserSubscription.findOne({ where: { user_id: userId } });
    } catch (err) {
      handleError(
        err,
        "fatal",
        "Db error. Failed to access subscription table looking for user"
      );
    }
  },

  findSubByQuery: async (query: UserWithSubscriptionPartialType) => {
    try {
      return await UserSubscription.findAll({ where: query });
    } catch (err) {
      handleError(
        err,
        "fatal",
        "Db error. Failed to access subscription table with query"
      );
    }
  },

  upgradeSub: async (
    userId: number,
    status: SubStatusNames,
    subNumber: number
  ) => {
    if (!userId || !status || subNumber < 0)
      throw new Error("Invalid parameters");
    try {
      return await UserSubscription.update(
        { sub_status: status, sub_number: subNumber },
        { where: { user_id: userId } }
      );
    } catch (err) {
      handleError(err, "fatal", "Db error. Failed to upgrade subscription");
    }
  },

  updateSubStatus: async (userId: number, status: SubStatusNames) => {
    if (!userId || !status) throw new Error("Invalid parameters");
    try {
      return await UserSubscription.update(
        { sub_status: status },
        { where: { user_id: userId } }
      );
    } catch (err) {
      handleError(
        err,
        "fatal",
        "Db error. Failed to update subscription status"
      );
    }
  },
};
