import type {
  UserWithSubscription,
  UserWithSubscriptionPartialType,
} from "#types/shared.types.js";
import Subscription, {
  UserSubscriptionType,
} from "../models/UserSubscription.js";
import User, { UserT } from "../models/User.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import dates from "#helpers/dates.js";

export default {
  findUser: async (query: Partial<UserT>) => {
    try {
      return await User.findOne({ where: query });
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. Inside usersController, userVerification is unavailable"
      );
    }
  },
  createUserWithId: (user_id: number) => {
    User.create({
      user_id,
      first_name: "",
      second_name: "",
      username: "",
      reg_date: dates.currDate(),
    });
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
  updateUserDataByQuery: (query: Partial<User>, filter: Partial<User>) => {
    return User.update(query, { where: filter });
  },
};
