import { Table, Model, Column, DataType } from "sequelize-typescript";
import User from "./User";
import type { PartialBy } from "@sequelize/utils";

export type SubDetailsType = {
  sub_id: number;
  sub_period: string;
  sub_price: number;
};

type CreationSubDetailsType = PartialBy<SubDetailsType, "sub_id">;

@Table({
  timestamps: true,
  tableName: "sub_details",
  modelName: "SubDetails",
})
export default class SubDetails extends Model<
  SubDetailsType,
  CreationSubDetailsType
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare sub_number: number;

  @Column({
    type: DataType.DATE,
  })
  declare sub_period: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare sub_price: number;
}
