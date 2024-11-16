import { Table, Model, Column, DataType } from "sequelize-typescript";
import type { PartialBy } from "@sequelize/utils";
import type MeetingsDetails from "./MeetingsDetails.js";

export type MeetingsType = {
  meeting_id: number;
  place: string;
  topic: string;
  date: Date;
  ended: boolean;
  MeetingsDetails?: MeetingsDetails[];
};

export type MeetingsCreationType = PartialBy<
  MeetingsType,
  "meeting_id" | "MeetingsDetails" | "ended"
>;

@Table({
  timestamps: false,
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
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare ended: boolean;

  @Column({
    type: DataType.DATE,
  })
  declare date: Date;
}
