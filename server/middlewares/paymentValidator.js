import {
  newSubscriptionSchema, unsubscribeSchema, subTokenSchema, planSchema,
  deleteCusSchema
} from './schema';
import validate from '../helpers/validate';

/**
 * @class searchValidator
 * @description Validates all user inputs
 * @exports PaymentValidator
 */
class PaymentValidator {
  /**
   * @method validateSubscription
   * @description validates new subscription details
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateSubscription(req, res, next) {
    const filters = { ...req.body.user };
    return validate(filters, newSubscriptionSchema, req, res, next);
  }

  /**
   * @method validateUnSubscription
   * @description validates unsubscribe details
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateUnSubscribe(req, res, next) {
    const filters = { ...req.body.user };
    return validate(filters, unsubscribeSchema, req, res, next);
  }

  /**
   * @method validateCreateToken
   * @description validates creating of token
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateCreateToken(req, res, next) {
    const filters = { ...req.body.card };
    return validate(filters, subTokenSchema, req, res, next);
  }

  /**
   * @method validatePlan
   * @description validates creating a plan
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validatePlan(req, res, next) {
    const filters = { ...req.body.plan };
    return validate(filters, planSchema, req, res, next);
  }

  /**
   * @method validateDeletePlan
   * @description validates deleting a plan
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {function} next - The next function to point to the next middleware
   * @returns {function} validate() - An execucted validate function
   */
  static validateDeletePlan(req, res, next) {
    const filters = { ...req.body.user };
    return validate(filters, deleteCusSchema, req, res, next);
  }
}

export default PaymentValidator;
