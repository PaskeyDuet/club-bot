import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import User from "./User";
import type { PartialBy } from "@sequelize/utils";
import Meetings from "./Meetings";

//TODO: Add visited property
export type MeetingsDetailsType = {
  id: number;
  meeting_id: number;
  user_id: number;
};

type MeetingsDetailsCreationType = PartialBy<MeetingsDetailsType, "id">;

@Table({
  timestamps: false,
  tableName: "meetings_details",
  modelName: "MeetingsDetails",
})
export default class MeetingsDetails extends Model<
  MeetingsDetailsType,
  MeetingsDetailsCreationType
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Meetings)
  @Column({
    type: DataType.INTEGER,
  })
  declare meeting_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare user_id: number;
}
