import {
  UserWithSubscription,
  UserWithSubscriptionPartialType,
} from "../../types/shared.types";
import Subscription from "../models/UserSubscription";
import User from "../models/User";
import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";

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
