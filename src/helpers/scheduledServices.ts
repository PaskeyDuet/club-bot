import meetingNotificator from "#controllers/meetingNotificator.js";
import cron from "node-cron";

export default function () {
  cron.schedule("0 18 * * *", meetingNotificator);
}
