import { Table, Model, Column, DataType } from "sequelize-typescript";
import type UserSubscription from "./UserSubscription.js";

export type DbUserAttributes = {
  user_id: number;
  first_name: string;
  second_name: string;
  username: string | undefined;
  reg_date: Date;
  UserSubscription?: UserSubscription[];
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
    type: DataType.STRING,
  })
  declare username: string;

  @Column({
    type: DataType.DATE,
  })
  declare reg_date: Date;
}
