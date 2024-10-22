import dates from "../../helpers/dates";
import SubDetails from "../models/SubDetails";
import Subscription from "../models/UserSubscription";
import User, { DbUserAttributes } from "../models/User";

export async function createUserDbImage(user: DbUserAttributes) {
  await User.create(user);
  const newbieSub = await SubDetails.findOne({ where: { sub_number: 1 } });
  if (newbieSub) {
    const subPeriod = newbieSub.duration_days;
    const date = new Date();
    const endDate = new Date(date); // Создаем новую дату на основе текущей
    endDate.setDate(date.getDate() + subPeriod); // Добавляем 30 дней
    await Subscription.create({
      user_id: user.user_id,
      sub_number: 1,
      sub_date: dates.currDate(),
      sub_status: "active",
      sub_end: endDate.toString(),
    });
  } else {
    throw new Error("found No newbie sub");
  }
}
