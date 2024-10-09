import { Op } from "sequelize";
import Meetings from "../models/Meetings";
import createDbDate from "../../helpers/createDbDate";

export default {
  allMeetings: () => Meetings.findAll(),
  futureMeetings: () => {
    return Meetings.findAll({
      where: { date: { [Op.gt]: createDbDate.currDate() } },
    });
  },
};
