import { Table, Model, Column, DataType } from "sequelize-typescript";
import type { PartialBy } from "@sequelize/utils";

export type SubDetailsType = {
  sub_number: number;
  duration_days: number;
  sub_price: number;
  sub_name: string;
};

type CreationSubDetailsType = PartialBy<SubDetailsType, "sub_number">;

@Table({
  timestamps: false,
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
    type: DataType.INTEGER,
  })
  declare duration_days: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare sub_price: number;

  @Column({
    type: DataType.STRING,
  })
  declare sub_name: string;
}
