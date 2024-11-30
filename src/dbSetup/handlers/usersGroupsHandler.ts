import UsersGroups, {
  type UserGroupsCreationT,
} from "#db/models/UsersGroups.js";
import type { Transaction } from "sequelize";

export default {
  createGroup(query: UserGroupsCreationT, transaction?: Transaction) {
    return UsersGroups.create(query, { transaction });
  },
  findGroup(query: Partial<UserGroupsCreationT>) {
    return UsersGroups.findOne({ where: query });
  },
};
