import { Op } from "sequelize";
import SubDetails from "../models/SubDetails.js";
import Subscription from "../models/UserSubscription.js";
import type { SubDetailsPartialType } from "#types/shared.types.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";

export default {
  getAllSubs: async () => {
    try {
      return await SubDetails.findAll();
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. SubDetailsController error: getAllSubs unavailable"
      );
    }
  },
  getAllButFirstSub: async () => {
    try {
      return SubDetails.findAll({ where: { sub_number: { [Op.gt]: 1 } } });
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. SubDetailsController error: getAllButFir.jsub unavailable"
      );
    }
  },
  findSubWithDetails: async (userId: number) => {
    try {
      return await SubDetails.findOne({
        include: {
          model: Subscription,
          required: true,
          where: { user_id: userId },
        },
      });
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. SubDetailsController error: findSubWithDetails unavailable"
      );
    }
  },
  findSubByQuery: async (query: SubDetailsPartialType) => {
    try {
      return await SubDetails.findOne({ where: query });
    } catch (err) {
      logErrorAndThrow(
        err,
        "fatal",
        "Db error. SubDetailsController error: findSubByQuery unavailable"
      );
    }
  },
};
