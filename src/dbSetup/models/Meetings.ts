import { Table, Model, Column, DataType } from "sequelize-typescript";
import type { PartialBy } from "@sequelize/utils";
export type MeetingsType = {
  meeting_id: number;
  place: string;
  topic: string;
  date: Date;
};

type MeetingsCreationType = PartialBy<MeetingsType, "meeting_id">;

@Table({
  timestamps: true,
  tableName: "meetings",
  modelName: "Meetings",
})
export default class Meetings extends Model<
  MeetingsType,
  MeetingsCreationType
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare meeting_id: number;

  @Column({
    type: DataType.STRING,
  })
  declare place: string;

  @Column({
    type: DataType.STRING,
  })
  declare topic: string;

  @Column({
    type: DataType.DATE,
  })
  declare date: Date;
}
