import subscriptionController from "#db/handlers/subscriptionController.ts";
import UserSubscription from "#db/models/UserSubscription.ts";
import guardExp from "./guardExp";
import notificator from "./notificator";

export async function validateSub(userId: number) {
  const h = validateSubHelpers;

  const userSub = await subscriptionController.findSub(userId);
  guardExp(userSub, "userSub inside validateSub");

  const subEnded = h.isSubEnded(userSub);
  h.makeSubUnactive(userSub, userId, subEnded);
  return userSub;
}

const validateSubHelpers = {
  isSubEnded(userSub: UserSubscription) {
    const subEnd = new Date(userSub.sub_end);
    const currDate = new Date();
    console.log(subEnd);
    console.log(currDate);

    return subEnd < currDate ? true : false;
  },
  async makeSubUnactive(
    userSub: UserSubscription,
    userId: number,
    subEnded: boolean
  ) {
    if (subEnded) {
      await subscriptionController.updateSubStatus(userId, "unactive");
      userSub.sub_status = "unactive";
    }
  },
};
