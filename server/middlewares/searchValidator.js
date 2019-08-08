import { searchFilterSchema, searchQuerySchema } from './schema';
import validate from '../helpers/validate';

/**
 * @class searchValidator
 * @description Validates all user inputs
 * @exports InputValidator
 */
class SearchValidator {
  /**
   * @method validateFilter
   * @description Validates filters when user searchs for an article
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateFilter(req, res, next) {
    const filters = { ...req.query, ...req.body };
    return validate(filters, searchFilterSchema, req, res, next);
  }

  /**
   * @method validateSearchQuery
   * @description Validates keyword query when user searchs for an article
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateKeyword(req, res, next) {
    const filters = req.query;
    return validate(filters, searchQuerySchema, req, res, next);
  }
}

export default SearchValidator;
