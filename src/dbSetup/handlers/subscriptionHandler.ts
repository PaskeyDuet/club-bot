import { SubStatusNames } from "../../types/shared.types";
import SubDetails from "../models/SubDetails";
import Subscription from "../models/Subscription";

export default {
  findSub: async (userId: number) =>
    await Subscription.findOne({ where: { user_id: userId } }),
  updateSub: async (
    userId: number,
    status: SubStatusNames,
    subNumber: number
  ) => {
    await Subscription.update(
      { sub_status: status, sub_number: subNumber },
      { where: { user_id: userId } }
    );
  },
};
