import models from '../db/models';
import payment from '../payment';
import helpers from '../helpers';


const { successStat } = helpers;

const {
  createCustomer, createSubscription, cancelSubscription, getAllSubscriptions,
  getAllPlans, createPlan, deletePlan, deleteCustomer, createToken
} = payment;

const { User, Subscriptions, Customer } = models;
// const { Op } = Sequelize;

/**
  * @Module PaymentController
  * @description Controlls payments and subscriptions of users
  */
class PaymentController {
  /**
   * @static
   * @description subscribes a user to a plan
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns object response
   * @memberof PaymentController
   */
  static async subscribe(req, res) {
    const { userId, planId } = req.body.user;
    const customer = await createCustomer(req.body.user);
    await Customer.create({ customerId: customer.id, userId });
    const subscription = await createSubscription(customer, planId);
    await Subscriptions.create({ subscriptionId: subscription.id, userId });
    await User.update({ activeSubscription: true }, { where: { id: userId } });
    return successStat(res, 201, 'result', {
      message: 'Subscription Successful',
      subscription
    });
  }

  /**
   * @static
   * @description unsubscribe a user from a plan
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns object response
   * @memberof PaymentController
   */
  static async unSubscribe(req, res) {
    const subscriptionId = req.params.id;
    const { userId } = req.body.user;
    const unSubscribe = await cancelSubscription(subscriptionId);
    await User.update({ activeSubscription: false }, { where: { id: userId } });
    return successStat(res, 200, 'result', {
      message: 'Subscription canceled',
      subscription: unSubscribe
    });
  }

  /**
   * @static
   * @description get all subscription
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns object response
   * @memberof PaymentController
   */
  static async getSubscription(req, res) {
    const subscriptions = await getAllSubscriptions();
    return successStat(res, 200, 'subscriptions', subscriptions);
  }

  /**
   * @static
   * @description user creates a new plan
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns object response
   * @memberof PaymentController
   */
  static async createPlan(req, res) {
    const { name } = req.body.plan;
    const plan = await createPlan(req.body.plan);
    return successStat(res, 201, 'result', {
      message: `${name} plan Successful created`,
      plan
    });
  }

  /**
   * @static
   * @description deletes a plan
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns object response
   * @memberof PaymentController
   */
  static async deletePlan(req, res) {
    const planId = req.params.id;
    const deletedPlan = await deletePlan(planId);
    return successStat(res, 200, 'result', {
      message: 'plan deleted',
      plan: deletedPlan
    });
  }

  /**
   * @static
   * @description get a plan
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns object response
   * @memberof PaymentController
   */
  static async getPlan(req, res) {
    // const subscription = await Subscriptions.findOne({ where: { userId: id } });
    const plans = await getAllPlans();
    return successStat(res, 200, 'subscriptions', plans);
  }

  /**
   * @static
   * @description delete a customer
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns object response
   * @memberof PaymentController
   */
  static async deleteCustomer(req, res) {
    const { userId } = req.body.user;
    const customer = await Customer.findOne({ where: { userId } });
    const { customerId } = customer.dataValues;
    const deletedCustomer = await deleteCustomer(customerId);
    return successStat(res, 200, 'result', {
      message: 'customer deleted',
      customer: deletedCustomer
    });
  }

  /**
   * @static
   * @description create a token
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns object response
   * @memberof PaymentController
   */
  static async createToken(req, res) {
    const token = await createToken(req.body.card);
    return successStat(res, 201, 'result', {
      message: 'token Successful created',
      token
    });
  }
}

export default PaymentController;
