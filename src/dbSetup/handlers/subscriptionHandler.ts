import {
  SubStatusNames,
  UserWithSubscriptionPartialType,
} from "../../types/shared.types";
import Subscription from "../models/Subscription";

export default {
  findSub: async (userId: number) =>
    await Subscription.findOne({ where: { user_id: userId } }),
  findSubByQuery: async (query: UserWithSubscriptionPartialType) =>
    await Subscription.findAll({ where: query }),
  upgradeSub: async (
    userId: number,
    status: SubStatusNames,
    subNumber: number
  ) =>
    await Subscription.update(
      { sub_status: status, sub_number: subNumber },
      { where: { user_id: userId } }
    ),
  updateSubStatus: async (userId: number, status: SubStatusNames) =>
    await Subscription.update(
      { sub_status: status },
      { where: { user_id: userId } }
    ),
};
