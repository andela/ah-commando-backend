import models from '../db/models';
import utils from './Utilities';
import articleSearch from './articleSearch';

const { querySearch, filterSearch } = articleSearch;

/**
 * @Module Paginate
 * @description Controlls all activities related to Articles
 */
class Paginate {
  /**
   * @description paginate all articles
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} returns articles base on the pagination params
   * @memberof Paginate
   */
  static async paginateArticles(req, res) {
    const { searchQuery } = req.query;
    let { page, limit } = req.query;
    const queryFilters = req.body;
    limit = parseInt(limit, 10) ? limit : 5;
    page = parseInt(page, 10) > 0 ? page : 1;
    const offset = (page - 1) * limit;
    let articles;
    if (!searchQuery) {
      articles = await models.Article.findAndCountAll({
        where: {},
        offset,
        limit
      });
    } else if (searchQuery && Object.keys(queryFilters)[0] !== 'undefined') {
      articles = await filterSearch(searchQuery, queryFilters, limit, offset);
    } else {
      articles = await querySearch(searchQuery, limit, offset);
    }
    if (articles.rows.length < 1) {
      return utils.errorStat(res, 404, 'Page not found');
    }
    return utils.successStat(res, 200, 'articles', articles);
  }
}

export default Paginate;
