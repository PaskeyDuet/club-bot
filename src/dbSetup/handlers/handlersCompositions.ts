import dates from "../../helpers/dates";
import SubDetails from "../models/SubDetails";
import Subscription from "../models/UserSubscription";
import User, { type DbUserAttributes } from "../models/User";
import { guardExp } from "#helpers/index.js";

export default {
  createUserDbImage: async (user: DbUserAttributes) => {
    await User.create(user);
    const newbieSub = await SubDetails.findOne({ where: { sub_number: 1 } });
    guardExp(newbieSub, "newbieSub inside handlersComposition");

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
