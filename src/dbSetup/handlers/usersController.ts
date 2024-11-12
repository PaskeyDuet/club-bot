import type {
  UserWithSubscription,
  UserWithSubscriptionPartialType,
} from "#types/shared.types.js";
import Subscription from "../models/UserSubscription.js";
import User from "../models/User.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";

export default {
  userVerification: async (
    userId: number
  ): Promise<User | null | undefined> => {
    try {
      return await User.findOne({ where: { user_id: userId } });
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. Inside usersController, userVerification is unavailable"
      );
    }
  },
  findUsersWithSub: async (
    query: UserWithSubscriptionPartialType
  ): Promise<UserWithSubscription[] | undefined> => {
    try {
      return (await User.findAll({
        include: {
          model: Subscription,
          required: true,
          where: query,
        },
      })) as UserWithSubscription[];
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. Inside usersController, findUsersWithSub is unavailable"
      );
    }
  },
};
