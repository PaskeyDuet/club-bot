import Subscription from "../models/Subscription";

export default {
  findSub: async (userId: number) =>
    await Subscription.findOne({ where: { user_id: userId } }),
};
