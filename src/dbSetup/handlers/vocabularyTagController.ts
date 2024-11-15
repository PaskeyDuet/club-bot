import VocabularyTags, {
  type VocabularyTagsCreationT,
  type VocabularyTagsT,
} from "#db/models/VocabularyTags.js";
import type { Transaction } from "sequelize";
type tagsMapT = Map<number, string>;
export default {
  createTags(tag_names: VocabularyTagsCreationT[], transaction: Transaction) {
    return VocabularyTags.bulkCreate(tag_names, { transaction });
  },
  findTag(query: Partial<VocabularyTagsT>) {
    return VocabularyTags.findOne({ where: query });
  },
  async getTagsMap(): Promise<tagsMapT> {
    const tagsObjs = await VocabularyTags.findAll();
    return tagsObjs.reduce((acc: tagsMapT, el) => {
      return acc.set(el.id, el.tag_name);
    }, new Map());
  },
};
