import MeetingsVocabulary, {
  type MeetingsVocabularyCreationT,
} from "#db/models/MeetingsVocabulary.js";
import type { Transaction } from "sequelize";

export default {
  createVocabularyUnits(
    vocabUnits: MeetingsVocabularyCreationT[],
    transaction: Transaction
  ) {
    return MeetingsVocabulary.bulkCreate(vocabUnits, { transaction });
  },
};
