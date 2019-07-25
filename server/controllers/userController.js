import sequelize from 'sequelize';
import models from '../db/models';
import utils from '../helpers/Utilities';
import hash from '../helpers/passwordHash';

const { Op } = sequelize;

/**
  * @Module UserController
  * @description Controlls all the user based activity
  */
class UserController {
  /**
    * @static
    * @description Allows a user to sign up
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} object contains user data and access Token
    * @memberof UserController
    */
  static async signUp(req, res) {
    const {
      firstname, lastname, email, username, password
    } = req.body;
    const existingUser = await models.User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });
    if (existingUser) {
      return utils.errorStat(res, 409, 'User Already Exists');
    }
    const newUser = {
      firstname, lastname, email, username, password: hash.hashPassword(password)
    };
    const user = await models.User.create(newUser);
    utils.successStat(res, 201, 'user', {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  }
}

export default UserController;
