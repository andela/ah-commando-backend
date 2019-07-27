import sequelize from 'sequelize';
import models from '../db/models';
import utils from '../helpers/Utilities';
import hash from '../helpers/passwordHash';
import auth from '../helpers/auth';

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
    * @returns {Object} object containing user data and access Token
    * @memberof UserController
    */
  static async signUp(req, res) {
    const {
      firstname, lastname, email, username, password
    } = req.body.user;
    const existingUser = await models.User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });
    if (existingUser) {
      return utils.errorStat(res, 409, 'User Already Exists');
    }
    const newUser = { ...req.body.user, password: hash.hashPassword(password) };
    const user = await models.User.create(newUser);
    const token = auth.generateToken({ id: user.id, username, email });
    return utils.successStat(res, 201, 'user', {
      id: user.id, token, username, firstname, lastname, email,
    });
  }

  /**
    * @static
    * @description Allows a user to sign in
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} object containing user data and access Token
    * @memberof UserController
    */
  static async login(req, res) {
    const { email, password } = req.body.user;
    const user = await models.User.findOne({ where: { email } });

    if (!user) return utils.errorStat(res, 401, 'Incorrect Login information');
    const matchPasswords = hash.comparePassword(password, user.password);
    if (!matchPasswords) return utils.errorStat(res, 401, 'Incorrect Login information');

    return utils.successStat(res, 200, 'user', {
      id: user.id,
      token: await auth.generateToken({ id: user.id, username: user.username, email }),
      firstname: user.firstname,
      lastname: user.firstname,
      username: user.username,
      email,
      bio: user.bio,
      image: user.image,
    });
  }
}

export default UserController;
