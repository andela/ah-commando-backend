import {
  userSchema,
  loginSchema,
  profileSchema,
  articleSchema,
  resetPasswordSchema,
  resetEmailSchema,
  commentBodySchema,
  bookmarkParamSchema,
  likesSchema,
  idSchema,
  reportArticleSchema,
  highlightDataSchema,
  getHighlightSchema,
  roleBodySchema,
  newUserSchema,
  updateUserSchema,
  getUserSchema
} from './schema';

import validate from '../helpers/validate';
import util from '../helpers/Utilities';

/**
 * @class InputValidator
 * @description Validates all user inputs
 * @exports InputValidator
 */
class InputValidator {
  /**
   * @method validateUser
   * @description Validates user details on signup
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateUser(req, res, next) {
    const user = { ...req.body.user };
    return validate(user, userSchema, req, res, next);
  }

  /**
   * @method validateLogin
   * @description Validates user login details on login
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateLogin(req, res, next) {
    const login = { ...req.body.user };
    return validate(login, loginSchema, req, res, next);
  }

  /**
   * @method validateUser
   * @description Validates user details on profile edit
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateProfileUpdate(req, res, next) {
    const profile = { ...req.body.user };
    return validate(profile, profileSchema, req, res, next);
  }

  /**
  * @method validateArticle
  * @description Validates articles input details
  * @param {object} req - The Request Object
  * @param {object} res - The Response Object
  * @param {function} next - The next function to point to the next middleware
  * @returns {function} validate() - An execucted validate function
  */
  static validateArticle(req, res, next) {
    const article = { ...req.body.article };
    return validate(article, articleSchema, req, res, next);
  }

  /**
   * @method validatePasswordReset
   * @description Validates user input for password reset
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validatePasswordReset(req, res, next) {
    const password = { ...req.body.user };
    return validate(password, resetPasswordSchema, req, res, next);
  }

  /**
   * @method validateEmail
   * @description Validates user email input for password reset
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateEmail(req, res, next) {
    const email = { ...req.body.user };
    return validate(email, resetEmailSchema, req, res, next);
  }

  /**
   * @method validateCommentMessage
   * @description Validate message input made by user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateCommentMessage(req, res, next) {
    const comment = { ...req.body };
    return validate(comment, commentBodySchema, req, res, next);
  }

  /**
   * @method validateBookmark
   * @description Validates user details on signup
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateBookmark(req, res, next) {
    const articleId = req.params;
    return validate(articleId, bookmarkParamSchema, req, res, next);
  }

  /**
   * @method validateLikes
   * @description Validates article likes
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateLikes(req, res, next) {
    const likes = { ...req.body.liked, ...req.params };
    return validate(likes, likesSchema, req, res, next);
  }

  /**
   * @method validateId
   * @description Validate id
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateId(req, res, next) {
    return validate(req.params, idSchema, req, res, next);
  }


  /**
   * @method validateReportArticle
   * @description Validate report article
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateReportArticle(req, res, next) {
    const reportId = { ...req.params };
    return validate(reportId, reportArticleSchema, req, res, next);
  }

  /**
   * @method validateHighlightdata
   * @description Validate the highligh data as given from the frontend
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateHighlightData(req, res, next) {
    const highlightData = { ...req.body.highlight, ...req.params };
    return validate(highlightData, highlightDataSchema, req, res, next);
  }

  /**
  * @method validateHighlightdata
  * @description Validate the highligh id
  * @param {object} req - The Request Object
  * @param {object} res - The Response Object
  * @param {function} next - The next function to point to the next middleware
  * @returns {function} validate() - An execucted validate function
  */
  static validateGetHighlight(req, res, next) {
    return validate(req.params, getHighlightSchema, req, res, next);
  }

  /**
   * @method validateParamsInput
   * @description Validate query parameter supplied
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateParamsInput(req, res, next) {
    const { username, id } = req.params;
    if (username) {
      const regex = /^[0-9a-zA-Z\\/_-]+$/;
      if (!regex.test(username)) {
        return util.errorStat(res, 400, 'Invalid type for username: type should be a string');
      }
    }
    if (id) {
      const regex = /^[0-9]+$/;
      /* istanbul ignore next-line */
      if (!regex.test(id)) {
        return util.errorStat(res, 400, 'Invalid type for id: type should be an integer');
      }
    }
    return next();
  }

  /**
   * @method validateRoleInput
   * @description Validate role input made by user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateRoleInput(req, res, next) {
    const role = { ...req.body };
    return validate(role, roleBodySchema, req, res, next);
  }

  /**
   * @method validateNewUser
   * @description Validates new user created by a god
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateNewUser(req, res, next) {
    const user = { ...req.body.user };
    return validate(user, newUserSchema, req, res, next);
  }

  /**
   * @method validateUpdateUser
   * @description Validates updating of a user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateUpdateUser(req, res, next) {
    const user = { ...req.body.user };
    return validate(user, updateUserSchema, req, res, next);
  }

  /**
  * @method getUser
  * @description Validates getting a user
  * @param {object} req - The Request Object
  * @param {object} res - The Response Object
  * @param {function} next - The next function to point to the next middleware
  * @returns {function} validate() - An execucted validate function
  */
  static validateGetUser(req, res, next) {
    return validate({ ...req.params }, getUserSchema, req, res, next);
  }
}

export default InputValidator;
