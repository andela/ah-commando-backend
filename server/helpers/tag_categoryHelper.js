import models from '../db/models';

const {
  Categories, Tags, ArticleTags
} = models;
/**
  * @Module Helper
  * @description Controlls all the user based activity
  */
class TagCategory {
  /**
    * @static
    * @description adds tag to a article
    * @param {String} tags - tags
    * @param {String} articleId - articleId
    * @returns {String} Encrypted password
    * @memberof TagCategory
    */
  static async addTags(tags, articleId) {
    const tagArray = tags.split(/[ ,]/);
    tagArray.forEach(async (tagItem) => {
      const tag = await Tags.findOrCreate({ where: { name: tagItem } });
      const tagId = tag[0].dataValues.id;
      await ArticleTags.create({ tagId, articleId });
    });
  }

  /**
    * @static
    * @description adds tag to a article
    * @param {String} categories - categories
    * @param {String} articleId - articleId
    * @returns {String} Encrypted password
    * @memberof TagCategory
    */
  static async addCategories(categories, articleId) {
    const categoryArray = categories.split(/[ ,]/);
    categoryArray.forEach(async (categoryItem) => {
      const category = await Categories.findOrCreate({ where: { name: categoryItem } });
      const categoryId = category[0].dataValues.id;
      await ArticleTags.create({ categoryId, articleId });
    });
  }
}

export default TagCategory;
