import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import type { PartialBy } from "@sequelize/utils";
import type { SubStatusNames } from "types/shared.types.js";
import User from "./User.js";
import SubDetails from "./SubDetails.js";

export type UserSubscriptionType = {
  id?: number;
  user_id: number;
  sub_date: Date;
  sub_number: number;
  sub_status: SubStatusNames;
  sub_end: string;
};
type UserSubscriptionCreationAttributes = PartialBy<UserSubscriptionType, "id">;

@Table({
  timestamps: false,
  tableName: "user_subscriptions",
  modelName: "UserSubscription",
})
export default class UserSubscription extends Model<
  UserSubscriptionType,
  UserSubscriptionCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare user_id: number;

  @Column({
    type: DataType.DATE,
  })
  declare sub_date: Date;

  @ForeignKey(() => SubDetails)
  @Column({
    type: DataType.INTEGER,
  })
  declare sub_number: number;
  @Column({
    type: DataType.STRING,
  })
  declare sub_status: SubStatusNames;
  @Column({
    type: DataType.DATE,
  })
  declare sub_end: string;
}
