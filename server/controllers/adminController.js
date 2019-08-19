import sequelize from 'sequelize';
import models from '../db/models';
import helpers from '../helpers';


const {
  errorStat, successStat, hashPassword, generateToken, Mail
} = helpers;

const { Op } = sequelize;
const { User } = models;

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

  /**
    * @static
    * @description Allows a super-admin to create new user
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} object containing user data and access Token
    * @memberof AdminController
    */
  static async createUser(req, res) {
    const {
      firstname, lastname, email, username
    } = req.body.user;
    const userRole = req.body.user.role;
    const { role } = req.user;
    if (role !== 'god') return errorStat(res, 401, 'You cannot perform this action. Please contact a god');
    const password = process.env.NEW_USER_PASSWORD;
    const existingUser = await models.User.findOne({
      where: {
        [Op.or]: [{ email }]
      }
    });
    if (existingUser) {
      return errorStat(res, 409, 'User Already Exists');
    }
    const newUser = { ...req.body.user, password: hashPassword(password), verified: false };
    const user = await models.User.create(newUser);
    const token = generateToken({ id: user.id, email });

    const mail = new Mail({
      to: user.email,
      subject: "Welcome to Authors' Haven",
      messageHeader: `Hi, ${user.firstname}!`,
      messageBody: `You have being added as a/an ${userRole}, your login details is given below
      username: ${username}
      password: ${password} 
      please, click on the link below to verify your email and change your password as soon as possible`,
      iButton: true
    });
    mail.InitButton({
      text: 'Verify Email',
      link: `${process.env.APP_URL}/api/v1/users/confirmEmail?token=${token}&id=${user.id}`,
    });
    mail.sendMail();
    return successStat(res, 201, 'user', {
      id: user.id,
      token,
      firstname,
      lastname,
      username,
      email,
      role: userRole,
      isActive: user.isActive
    });
  }

  /**
    * @static
    * @description Allows a super-admin to update new user
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} object containing user data and access Token
    * @memberof AdminController
    */
  static async updateUser(req, res) {
    const { id } = req.params;
    const { role } = req.user;
    if (role !== 'god') return errorStat(res, 401, 'You cannot perform this action. Please contact a god');
    await User.update(req.body.user, { where: { id }, returning: true });
    const user = await User.findOne({ where: { id } });
    return successStat(res, 201, 'user', {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  }

  /**
    * @static
    * @description Allows a super-admin to update new user
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} object containing user data and access Token
    * @memberof AdminController
    */
  static async getUser(req, res) {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    return successStat(res, 200, 'user', {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  }
}

export default AdminController;
