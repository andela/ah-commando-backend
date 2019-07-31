import sequelize from 'sequelize';
import models from '../db/models';
import helpers from '../helpers';

const { Op } = sequelize;
const {
  addToBlacklist, generateToken, errorStat, successStat,
  comparePassword, hashPassword, verifyToken, Mail
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
    const newUser = { ...req.body.user, password: hashPassword(password), verified: false };
    const user = await models.User.create(newUser);
    const token = generateToken({ id: user.id, username, email });

    const mail = new Mail({
      to: user.email,
      subject: 'Welcome email',
      messageHeader: `Hi, ${user.firstname}!`,
      messageBody: 'We are exicted to get you started. First, you have to verify your account. Just click on the link below',
      iButton: true
    });
    mail.InitButton({
      text: 'Verify Email',
      link: `${process.env.APP_URL}/api/v1/users/confirmEmail?token=${token}&id=${user.id}`,
    });
    mail.sendMail();
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
    * @returns {Object} object containing the user's profile
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
  * @description Send a user email on successful registration
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @returns {Object} object containing user data and access Token
  * @memberof UserController
  */
  static async confirmEmail(req, res) {
    const { token, id, resend } = req.query;
    if (resend) {
      const user = await models.User.findOne({ where: { id } });

      if (!user) return errorStat(res, 400, 'Unable to send verification email');
      const mail = new Mail({
        to: user.email,
        subject: 'Welcome email',
        messageHeader: `Hi, ${user.firstname}!`,
        messageBody: 'We are exicted to get you started. First, you have to verify your account. Just click on the link below',
        iButton: true
      });
      mail.InitButton({
        text: 'Verify Email',
        link: `${process.env.APP_URL}/api/v1/users/confirmEmail?token=${token}&id=${user.id}`,
      });
      mail.sendMail();
      return successStat(res, 200, 'message', 'Verification link has been sent to your email');
    }
    try {
      const verify = verifyToken(token);
      await models.User.update({ verified: true }, { where: { id: verify.id } });
      return successStat(res, 200, 'message', 'Email verified successfully');
    } catch (err) {
      return errorStat(res, 400, 'Unable to verifiy email');
    }
  }

  /**
   *  @static
    * @description Get authorised user's profile
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} object containing the user's profile
    * @memberof UserController
    */
  static async userProfile(req, res) {
    const { loggedInUser } = req;

    return successStat(res, 200, 'profile', {
      username: loggedInUser.username,
      bio: loggedInUser.bio,
      image: loggedInUser.image,
      following: loggedInUser.following
    });
  }

  /**
    * @static
    * @description Get another user's profile
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} object containing the user's profile
    * @memberof UserController
    */
  static async getAuserProfile(req, res) {
    const { username } = req.params;

    const user = await models.User.findOne({ where: { username } });

    if (!user) return errorStat(res, 404, 'No user found');

    return successStat(res, 200, 'profile', {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: user.following
    });
  }

  /**
  * @static
  * @description Edit user's profile
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @returns {Object} object containing the user's profile
  * @memberof UserController
  */
  static async editProfile(req, res) {
    const { id } = req.loggedInUser;
    const {
      image, bio, email, username
    } = req.body.user;

    await models.User.update({
      image, bio, email, username,
    }, { where: { id } });

    const updatedProfile = await models.User.findByPk(id);
    return successStat(res, 200, 'profile', {
      firstname: updatedProfile.firstname,
      lastname: updatedProfile.lastname,
      username: updatedProfile.username,
      bio: updatedProfile.bio,
      image: updatedProfile.image,
    });
  }
}

export default UserController;
