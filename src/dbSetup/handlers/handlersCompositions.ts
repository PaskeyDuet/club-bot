import { dates } from "#helpers/index.js";
import SubDetails from "../models/SubDetails.js";
import Subscription from "../models/UserSubscription.js";
import User, { type UserT } from "../models/User.js";
import { guardExp } from "#helpers/index.js";

export default {
  createUserDbImage: async (user: UserT) => {
    await User.create(user);
    const newbieSub = await SubDetails.findOne({ where: { sub_number: 1 } });
    guardExp(newbieSub, "newbieSub inside handlersComposition");
    let testCommit = "";
    const subPeriod = newbieSub.duration_days;
    const date = new Date();
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + subPeriod);
    await Subscription.create({
      user_id: user.user_id,
      sub_number: 1,
      sub_date: dates.currDate(),
      sub_status: "active",
      sub_end: endDate.toString(),
    });
  },
};
