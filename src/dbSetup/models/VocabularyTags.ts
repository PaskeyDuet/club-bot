import { Table, Model, Column, DataType } from "sequelize-typescript";
import type { PartialBy } from "@sequelize/utils";

export type VocabularyTagsT = {
  id: number;
  name: string;
};

type VocabularyTagsCreationT = PartialBy<VocabularyTagsT, "id">;

@Table({
  timestamps: false,
  tableName: "vocabulary_tags",
  modelName: "VocabularyTags",
})
export default class VocabularyTags extends Model<
  VocabularyTagsT,
  VocabularyTagsCreationT
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;
  @Column({ type: DataType.STRING }) declare name: string;
}
