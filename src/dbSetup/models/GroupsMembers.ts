import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import type { PartialBy } from "@sequelize/utils";
import User from "./User.js";
import UserGroups from "./UsersGroups.js";

export type GroupsMembersT = {
  id: number;
  user_id: number;
  group_id: number;
};

export type GroupsMembersCreationT = PartialBy<GroupsMembersT, "id">;

@Table({
  timestamps: false,
  tableName: "groups_members",
  modelName: "GroupsMembers",
})
export default class GroupsMembers extends Model<
  GroupsMembersT,
  GroupsMembersCreationT
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare user_id: number;

  @ForeignKey(() => UserGroups)
  @Column({ type: DataType.BIGINT })
  declare group_id: number;
}
