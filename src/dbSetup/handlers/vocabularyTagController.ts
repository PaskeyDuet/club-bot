import VocabularyTags, {
  type VocabularyTagsCreationT,
  type VocabularyTagsT,
} from "#db/models/VocabularyTags.js";
import type { Transaction } from "sequelize";

export default {
  createTags(tag_names: VocabularyTagsCreationT[], transaction: Transaction) {
    return VocabularyTags.bulkCreate(tag_names, { transaction });
  },
  findTag(query: Partial<VocabularyTagsT>) {
    return VocabularyTags.findOne({ where: query });
  },
};
