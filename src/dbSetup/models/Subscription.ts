import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import User from "./User";
import type { PartialBy } from "@sequelize/utils";
import {
  PrimaryKey,
  Attribute,
  AutoIncrement,
  NotNull,
  HasOne,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";

export type UserSubscription = {
  id: number;
  user_id: number;
  sub_date: string;
  sub_type: number;
};

type UserSubscriptionCreationAttributes = PartialBy<UserSubscription, "id">;

@Table({
  timestamps: true,
  tableName: "subscriptions",
  modelName: "Subscription",
})
export default class Subscription extends Model<UserSubscriptionCreationAttributes> {
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
  declare sub_date: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare sub_type: number;
}
