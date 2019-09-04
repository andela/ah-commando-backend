import { Op } from 'sequelize';
import models from '../db/models';

const {
  Article, User, Categories, Tags
} = models;
const searchQuery = keyWord => ({
  '$Article.title$': { [Op.iLike]: `%${keyWord}%` },
  '$Article.description$': { [Op.iLike]: `%${keyWord}%` },
  '$author.username$': { [Op.iLike]: `%${keyWord}%` },
  '$author.firstname$': { [Op.iLike]: `%${keyWord}%` },
  '$author.lastname$': { [Op.iLike]: `%${keyWord}%` }

});

const getSearchFilters = (categoryArray, tagArray, nameArray) => {
  const queryFilters = [];
  const categoryFilter = [];
  const authorFilter = [];
  const tagFilter = [];
  if (categoryArray) {
    categoryFilter.push({ '$Categories.name$': { [Op.in]: categoryArray } });
    queryFilters.push({ [Op.or]: categoryFilter });
  }
  if (tagArray) {
    tagFilter.push({ '$Tags.name$': { [Op.in]: tagArray } });
    queryFilters.push({ [Op.or]: tagFilter });
  }
  if (nameArray) {
    nameArray.forEach((item) => {
      authorFilter.push({ '$author.firstname$': { [Op.iLike]: `%${item}%` } });
      authorFilter.push({ '$author.lastname$': { [Op.iLike]: `%${item}%` } });
    });
    queryFilters.push({ [Op.or]: authorFilter });
  }
  return queryFilters;
};

/**
  * @Module ArticleSearch
  * @description Searches for an article using different filers
  */
class ArticleSearch {
  /**
   * @static
   * @param {string} searchWord - search word
   * @param {string} searchlimit - searchlimit
   * @param {string} pageoffset - pageoffset
   * @returns {object} - articles
   * @memberof ArticleSearch
   */
  static async querySearch(searchWord, searchlimit, pageoffset) {
    const limit = searchlimit || 20;
    const offset = pageoffset || 0;
    const queryFields = searchQuery(searchWord);
    const articles = await Article.findAndCountAll({
      limit,
      offset,
      where: {
        [Op.or]: queryFields
      },
      include: [{ model: User, as: 'author', attributes: ['firstname', 'lastname', 'username', 'image'] },
        {
          model: Categories, attributes: ['name'], through: { attributes: [] }, duplicating: false
        },
        {
          model: Tags, attributes: ['name'], through: { attributes: [] }, duplicating: false
        },
        {
          model: models.Comment,
          as: 'comment',
          duplicating: false
        }
      ],
    });
    return articles;
  }


  /**
   * @static
   * @param {string} searchWord - search word
   * @param {string} filterObject - filters
   * @param {string} searchlimit - searchlimit
   * @param {string} pageoffset - pageoffset
   * @returns {object} - articles
   * @memberof ArticleSearch
   */
  static async filterSearch(searchWord, filterObject, searchlimit, pageoffset) {
    const limit = searchlimit || 20;
    const offset = pageoffset || 0;
    const { categories, tags, authorNames } = filterObject[Object.keys(filterObject)[0]];
    const categoryArray = categories && categories.split(/[ ,]/);
    const tagArray = tags && tags.split(/[ ,]/);
    const nameArray = authorNames && authorNames.split(/[ ,]/);
    const queryFilters = getSearchFilters(categoryArray, tagArray, nameArray);
    const queryFields = searchQuery(searchWord);
    const articles = await Article.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: User, as: 'author', attributes: ['firstname', 'lastname', 'username', 'image'], duplicating: false
        },
        {
          model: Categories, attributes: ['name'], through: { attributes: [] }, duplicating: false
        },
        {
          model: Tags, attributes: ['name'], through: { attributes: [] }, duplicating: false
        },
        {
          model: models.Comment,
          as: 'comment',
          duplicating: false
        }
      ],
      where: { [Op.and]: [{ [Op.or]: queryFields }, { [Op.and]: queryFilters }] }
    });
    return articles;
  }
}

export default ArticleSearch;
