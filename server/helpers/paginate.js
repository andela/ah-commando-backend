import utils from './Utilities';
import articleSearch from './articleSearch';

const { querySearch, filterSearch } = articleSearch;

const { errorStat, successStat } = utils;


/**
 * @Module Paginate
 * @description Controlls all activities related to Articles
 */
class Paginate {
  /**
   * @description paginate all entries
   * @param {Object} page - page number
   * @param {Object} limit - limit per page
   * @param {Object} modelToQuery - the model to query
   * @param {Object} result - the key for the received data
   * @param {Object} res - response object
   * @param {Object} req - response object
   * @param {Object} include - Include Object
   * @returns {Object} returns articles base on the pagination params
   * @memberof Paginate
   */
  static async paginate(page, limit, modelToQuery, result, res, req, include = '') {
    const { searchQuery } = req.query;
    const queryFilters = req.body;
    limit = parseInt(limit, 10) ? limit : 5;
    page = parseInt(page, 10) > 0 ? page : 1;
    const offset = (page - 1) * limit;
    let resultFromDb;
    if (!searchQuery) {
      resultFromDb = await modelToQuery.findAndCountAll({
        where: {},
        offset,
        limit,
        include
      });
    } else if (searchQuery && Object.keys(queryFilters)[0] !== 'undefined') {
      resultFromDb = await filterSearch(searchQuery, queryFilters, limit, offset);
    } else {
      resultFromDb = await querySearch(searchQuery, limit, offset);
    }
    if (resultFromDb.rows.length < 1) {
      return errorStat(res, 404, 'Page not found');
    }
    return successStat(res, 200, result, {
      page,
      numberOfPages: Math.ceil(resultFromDb.count / limit).toString(),
      data: resultFromDb.rows
    });
  }
}

export default Paginate;
