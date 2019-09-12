import sequelize from 'sequelize';
import models from '../db/models';
import helpers from '../helpers';

const { Op } = sequelize;
const { successStat } = helpers;

/**
  * @Module NotificationController
  * @description Controlls comments made by users
  */
class NotificationController {
  /**
   * @static
   * @param {*} req Request object
   * @param {*} res Response object
   * @returns {Object} server response
   * @memberof NotificationController
   */
  static async getNotifications(req, res) {
    const { user: { id } } = req;
    const user = await models.User.findByPk(id);
    return successStat(res, 200, 'notifications', await user.getNotifications({ where: { read: false } }));
  }

  /**
   * @static
   * @param {*} req Request object
   * @param {*} res Response object
   * @returns {Object} server response
   * @memberof NotificationController
   */
  static async markAsRead(req, res) {
    const { user: { id }, params, } = req;
    await models.Notification.update({
      read: true,
    }, {
      where: {
        [Op.and]: [{ id: params.id }, { userId: id }]
      }
    });
    return successStat(res, 200, 'message', 'marked as read');
  }

  /**
   * @static
   * @param {*} req Request object
   * @param {*} res Response object
   * @returns {Object} server response
   * @memberof NotificationController
   */
  static async markAllAsRead(req, res) {
    const { id } = req.user;
    await models.Notification.update({ read: true }, {
      where: {
        userId: id,
      }
    });
    return successStat(res, 200, 'message', 'all notifications marked as read');
  }

  /**
   * @static
   * @param {*} req Request object
   * @param {*} res Response object
   * @returns {Object} server response
   * @memberof NotificationController
   */
  static async emailSubscribe(req, res) {
    const { user: { id }, method } = req;
    await models.User.update({ newPostEmailSub: method === 'PATCH', }, { where: { id } });
    return successStat(res, 200, 'message', `email notification ${method === 'PATCH' ? 'enabled' : 'disabled'}`);
  }
}

export default NotificationController;
