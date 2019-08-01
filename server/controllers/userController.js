import sequelize from 'sequelize';
import models from '../db/models';
import helpers from '../helpers';

const { Op } = sequelize;
const {
  addToBlacklist, generateToken, errorStat, successStat,
  comparePassword, hashPassword
} = helpers;

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
      return errorStat(res, 409, 'User Already Exists');
    }
    const newUser = { ...req.body.user, password: hashPassword(password) };
    const user = await models.User.create(newUser);
    const token = generateToken({ id: user.id, username, email });
    return successStat(res, 201, 'user', {
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

    if (!user) return errorStat(res, 401, 'Incorrect Login information');
    const matchPasswords = comparePassword(password, user.password);
    if (!matchPasswords) return errorStat(res, 401, 'Incorrect Login information');

    return successStat(res, 200, 'user', {
      id: user.id,
      token: await generateToken({ id: user.id, username: user.username, email }),
      firstname: user.firstname,
      lastname: user.firstname,
      username: user.username,
      email,
      bio: user.bio,
      image: user.image,
    });
  }

  /**
    * @static
    * @description Allows a user to sign out
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} object containing user data and access Token
    * @memberof UserController
    */
  static async logout(req, res) {
    const authorizationHeader = req.headers.authorization;
    const token = req.headers.authorization.split(' ')[1] || authorizationHeader;
    await addToBlacklist(token);
    return successStat(res, 204, 'message', 'No Content');
  }

  /**
* @static
* @description Allows a user to sign in with social accounts
* @param {Object} req - Request object
* @param {Object} res - Response object
* @param {function} next next function to be called
* @returns {Object} object containing user data and access Token
* @memberof UserController
*/
  static async socialSignin(req, res) {
    if (!req.user) {
      return errorStat(res, 404, 'Account not found');
    }
    const userDetails = req.user;

    const firstname = userDetails.displayName.split(' ')[0];
    const lastname = userDetails.displayName.split(' ')[1];
    const username = userDetails.emails[0].value;
    const imageUrl = userDetails.image;
    const isVerified = userDetails.email_verified;
    const email = userDetails.emails[0].value;

    const newUser = await models.User.findOrCreate({
      where: { email },
      defaults: {
        firstname,
        lastname,
        email,
        password: 'null',
        bio: '',
        username,
        image: imageUrl,
        verified: isVerified,
      }
    });
    const token = generateToken({
      id: newUser.id,
      email: userDetails.email
    });

    const { bio } = newUser[0];

    return successStat(res, 200, 'user', {
      token,
      firstname,
      lastname,
      email,
      username,
      bio,
      imageUrl,
    });
  }
}

export default UserController;
