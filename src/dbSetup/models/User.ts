import { HasOne } from "sequelize";
import { Table, Model, Column, DataType } from "sequelize-typescript";
import type { PartialBy } from "@sequelize/utils";

export type DbUserAttributes = {
  user_id: number;
  first_name: string;
  second_name: string;
  reg_date: Date;
};

@Table({
  timestamps: false,
  tableName: "users",
  modelName: "User",
})
export default class User extends Model<DbUserAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    unique: true,
  })
  declare user_id: number;

  @Column({
    type: DataType.STRING,
  })
  declare first_name: string;

  @Column({
    type: DataType.STRING,
  })
  declare second_name: string;

  @Column({
    type: DataType.DATE,
  })
  declare reg_date: Date;
}
