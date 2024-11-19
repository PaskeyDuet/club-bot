import { Table, Model, Column, DataType } from "sequelize-typescript";
import type { PartialBy } from "@sequelize/utils";

export type UserGroupsT = {
  id: number;
  active: boolean;
  trial_period: boolean;
  chat_id: number;
};

export type UserGroupsCreationT = PartialBy<UserGroupsT, "id" | "active">;

@Table({
  timestamps: true,
  tableName: "userGroups",
  modelName: "UserGroups",
})
export default class UsersGroups extends Model<
  UserGroupsT,
  UserGroupsCreationT
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare active: boolean;
  @Column({ type: DataType.BOOLEAN }) declare trial_period: boolean;
  @Column({ type: DataType.BIGINT, unique: true }) declare chat_id: number;
}
