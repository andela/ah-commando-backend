import {
  userSchema,
  loginSchema,
} from './schema';
import validate from '../helpers/validate';

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
}

export default InputValidator;
