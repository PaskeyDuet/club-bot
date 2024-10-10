import { Op } from "sequelize";
import Meetings from "../models/Meetings";
import dates from "../../helpers/dates";

export default {
  allMeetings: () => Meetings.findAll(),
  futureMeetings: () => {
    return Meetings.findAll({
      where: { date: { [Op.gt]: dates.currDate() } },
    });
  },
};
