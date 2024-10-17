import { Op } from "sequelize";
import SubDetails from "../models/SubDetails";
import Subscription from "../models/Subscription";
import { SubDetailsPartialType } from "../../types/shared.types";

export default {
  getAllSubs: async () => await SubDetails.findAll(),
  getAllButFirstSub: async () =>
    SubDetails.findAll({ where: { sub_number: { [Op.gt]: 1 } } }),
  findSubWithDetails: async (userId: number) =>
    await SubDetails.findOne({
      include: {
        model: Subscription,
        required: true,
        where: { user_id: userId },
      },
    }),
  findSubByQuery: async (query: SubDetailsPartialType) =>
    await SubDetails.findOne({ where: query }),
};
