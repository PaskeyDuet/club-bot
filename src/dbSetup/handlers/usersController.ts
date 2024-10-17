import {
  UserWithSubscription,
  UserWithSubscriptionPartialType,
} from "../../types/shared.types";
import Subscription from "../models/Subscription";
import User from "../models/User";

export default {
  userVerification: async (userId: number): Promise<User | null> => {
    return await User.findOne({ where: { user_id: userId } });
  },
  findUsersWithSub: async (
    query: UserWithSubscriptionPartialType
  ): Promise<UserWithSubscription[]> => {
    return (await User.findAll({
      include: {
        model: Subscription,
        required: true,
        where: query,
      },
    })) as UserWithSubscription[];
  },
};
