import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import User from "./User.js";
import type { PartialBy } from "@sequelize/utils";
import Meetings from "./Meetings.js";
import VocabularyTags from "./VocabularyTags.js";

export type MeetingsVocabularyT = {
  id: number;
  meeting_id: number;
  lexical_unit: string;
  translation: string;
  example: string;
  example_translation: string;
  tag_id: number;
};
export type RawVocabularyWithTagNameT = {
  lexical_unit: string;
  translation: string;
  example: string;
  example_translation: string;
  tag_name: string;
};

export type MeetingsVocabularyCreationT = PartialBy<MeetingsVocabularyT, "id">;

@Table({
  timestamps: false,
  tableName: "meetings_vocabulary",
  modelName: "MeetingsVocabulary",
})
export default class MeetingsVocabulary extends Model<
  MeetingsVocabularyT,
  MeetingsVocabularyCreationT
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Meetings)
  @Column({ type: DataType.INTEGER })
  declare meeting_id: number;
  @Column({ type: DataType.STRING }) declare lexical_unit: string;
  @Column({ type: DataType.STRING }) declare translation: string;
  @Column({ type: DataType.STRING }) declare example: string;
  @Column({ type: DataType.STRING }) declare example_translation: string;
  @ForeignKey(() => VocabularyTags)
  @Column({ type: DataType.INTEGER })
  declare tag_id: number;
}
