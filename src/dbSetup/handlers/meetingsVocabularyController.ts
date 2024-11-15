import MeetingsVocabulary, {
  type MeetingsVocabularyT,
  type MeetingsVocabularyCreationT,
} from "#db/models/MeetingsVocabulary.js";
import type { Transaction } from "sequelize";

export default {
  findAllByQuery(query: Partial<MeetingsVocabularyT>) {
    return MeetingsVocabulary.findAll({ where: query });
  },
  createVocabularyUnits(
    vocabUnits: MeetingsVocabularyCreationT[],
    transaction: Transaction
  ) {
    return MeetingsVocabulary.bulkCreate(vocabUnits, { transaction });
  },
};
