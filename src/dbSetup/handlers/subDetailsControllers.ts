import { Op } from "sequelize";
import SubDetails from "../models/SubDetails";

export default {
  getAllSubs: async () => await SubDetails.findAll(),
  getAllButFirstSub: async () =>
    SubDetails.findAll({ where: { sub_number: { [Op.gt]: 1 } } }),
};
