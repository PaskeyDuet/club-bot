import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import User from "./User";
import type { PartialBy } from "@sequelize/utils";
import SubDetails from "./SubDetails";

export type UserSubscription = {
  id: number;
  user_id: number;
  sub_date: string;
  sub_number: number;
  sub_status: number;
  sub_end: string;
};

type UserSubscriptionCreationAttributes = PartialBy<
  UserSubscription,
  "id" | "sub_end"
>;

@Table({
  timestamps: true,
  tableName: "subscriptions",
  modelName: "Subscription",
})
export default class Subscription extends Model<
  UserSubscription,
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
    type: DataType.INTEGER,
  })
  declare sub_status: number;

  @Column({
    type: DataType.DATE,
  })
  declare sub_end: string;
}
