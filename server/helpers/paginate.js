import models from '../db/models';
import utils from './Utilities';

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
    let { page, limit } = req.query;
    limit = parseInt(limit, 10) ? limit : 5;
    page = parseInt(page, 10) > 0 ? page : 1;
    const offset = (page - 1) * limit;
    const articles = await models.Article.findAndCountAll({
      where: {},
      offset,
      limit
    });
    if (articles.rows.length < 1) {
      return utils.errorStat(res, 404, 'Page not found');
    }
    return utils.successStat(res, 200, 'articles', articles);
  }
}

export default Paginate;
