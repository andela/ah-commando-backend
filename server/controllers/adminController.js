import models from '../db/models';
import helpers from '../helpers';

const { errorStat, successStat } = helpers;
/**
  * @Module AdminController
  * @description Controls all Admin based activity
  */
class AdminController {
  /**
     * @static
     * @description assigns roles to users
     * @param {*} req - Request Object
     * @param {*} res - Response Object
     * @returns {object} - Containing a message or an error
     * @memberof UserController
     */
  static async assignRole(req, res) {
    const { newRole: { newRole }, username } = req.body;
    const { role } = req.user;
    const user = await models.User.findOne({ where: { username } });
    if (!user) return errorStat(res, 404, `No user found with username: ${username}`);
    if (role === 'moderator') return errorStat(res, 401, 'You cannot perform this action. Please contact an Admin');
    if (role === 'admin' && (newRole === 'god' || newRole === 'admin')) return errorStat(res, 401, 'You cannot perform this action. Please contact a god');
    await models.User.update({
      role: newRole
    }, {
      where: {
        username
      }
    });
    const updatedUser = await models.User.findOne({ where: { username } });
    return successStat(res, 200, 'user', updatedUser);
  }

  /**
     * @static
     * @description sets user active status
     * @param {*} req - Request Object
     * @param {*} res - Response Object
     * @returns {object} - Containing a message or an error
     * @memberof UserController
     */
  static async setActiveStatus(req, res) {
    const { username } = req.params;
    const user = await models.User.findOne({ where: { username } });
    if (!user) return errorStat(res, 404, `No user found with username: ${username}`);
    const { isActive } = user;
    const updatedUser = await models.User.update({
      isActive: !isActive
    }, {
      returning: true,
      where: {
        username
      }
    });
    return successStat(res, 200, 'user', updatedUser);
  }

  /**
   * @static
   * @description deletes a user from the platform
   * @param {*} req - Request Object
   * @param {*} res - Response Object
   * @returns {object} - Delete user
   */
  static async deleteAUser(req, res) {
    const { username } = req.params;
    const { role } = req.user;
    const userToDelete = await models.User.findOne({ where: { username } });
    if (!userToDelete) return errorStat(res, 404, `No user found with username: ${username}`);
    if (role !== 'god') return errorStat(res, 401, 'You cannot perform this action. Please contact a god');
    await models.DeletedUsers.create(userToDelete.dataValues);
    await models.User.destroy({ where: { username } });
    return successStat(res, 200, 'message', `user with username ${username} has been deleted from Author's Haven`);
  }

  /**
   * @static
   * @description deletes an article from the platform
   * @param {*} req - Request Object
   * @param {*} res - Response Object
   * @returns {object} - with deleted message or error
   */
  static async deleteAnArticle(req, res) {
    const { id } = req.params;
    const articleToDelete = await models.Article.findOne({ where: { id } });
    if (!articleToDelete) return errorStat(res, 404, 'Article not found');
    await models.Article.destroy({
      where: { id },
      include: [
        {
          as: 'comment',
          model: models.Comment
        }
      ]
    });
    return successStat(res, 200, 'message', 'Article deleted successfully');
  }

  /**
   * @static
   * @description deletes a commentfrom the platform
   * @param {*} req - Request Object
   * @param {*} res - Response Object
   * @returns {object} - with deleted message or error
   */
  static async deleteAComment(req, res) {
    const { id } = req.params;
    const commentToDelete = await models.Comment.findOne({ where: { id } });
    if (!commentToDelete) return errorStat(res, 404, 'Comment not found');
    await models.Comment.destroy({
      where: { id }
    });
    return successStat(res, 200, 'message', 'Comment deleted successfully');
  }

  /**
   * @static
   * @description gets a single user
   * @param {*} req - Request Object
   * @param {*} res - Response Object
   * @returns {object} - user details containing active status
   */
  static async getASingleUser(req, res) {
    const { username } = req.params;
    const foundUser = await models.User.findOne({
      where: {
        username
      },
      attributes: ['isActive', 'image', 'username', 'firstname', 'lastname', 'bio']
    });
    if (!foundUser) return errorStat(res, 404, 'User not found');

    return successStat(res, 200, 'data', foundUser);
  }
}

export default AdminController;
