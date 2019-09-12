import sequelize from 'sequelize';
import dotenv from 'dotenv';
import models from '../db/models';
import helpers from '../helpers';
import Notification from '../helpers/notifications';


dotenv.config();

const { Op } = sequelize;
const { PasswordResetTokens } = models;
const {
  addToBlacklist, generateToken, errorStat, successStat,
  comparePassword, hashPassword, verifyToken, Mail, paginate,
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
      subject: "Welcome to Authors' Haven",
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
      id: user.id,
      token,
      username,
      firstname,
      lastname,
      email,
      role: user.role,
      isActive: user.isActive
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
      role: user.role,
      isActive: user.isActive

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
  * @description Sends reset link to user Email
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @returns {Object} object containing user data which will be embedded in link sent to user
  * @memberof UserController
  */
  static async sendResetLink(req, res) {
    const { email } = req.body.user;
    const user = await models.User.findOne({ where: { email } });
    if (!user) return errorStat(res, 404, `No user found with email address: ${email}`);
    const { id, username } = user;
    const token = generateToken({ id, username, email });
    await PasswordResetTokens.create({ token, userId: id, email });
    const link = `${process.env.FRONT_END_URL}reset-password/?id=${id}&token=${token}`;
    const mail = new Mail({
      to: email,
      subject: 'Password Reset',
      messageHeader: `Hello ${user.firstname}`,
      messageBody: 'Click on the link below to reset your password',
      iButton: true
    });
    mail.InitButton({
      text: 'Reset Password',
      link,
    });
    mail.sendMail();

    return successStat(res, 200, 'message', `Hi ${user.firstname.toUpperCase()}, A password reset link has been sent to your mail-box`);
  }

  /**
    * @static
    * @description Updates the user password in the database
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} Object containing either a success or error message.
    * @memberof UserController
    */
  static async resetPassword(req, res) {
    const { password } = req.body.user;
    const { id, token } = req.params;
    const user = await models.User.findOne({ where: { id } });
    if (!user) return errorStat(res, 404, 'No user found');
    const isTokenAvailable = await PasswordResetTokens.findOne({ where: { userId: id, token, } });
    const payload = await verifyToken(token, (err, decoded) => decoded);
    if (!payload
      || payload.id !== Number(id)
      || !isTokenAvailable) return errorStat(res, 401, 'Invalid Reset Token');
    const hashedPassword = hashPassword(password);
    await models.User.update({ password: hashedPassword }, { where: { id: user.id } });
    PasswordResetTokens.destroy({ where: { userId: id } });
    return successStat(res, 200, 'message', 'Success, Password Reset Successfully');
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

    return res.redirect(`${process.env.FRONT_END_URL}?token=${token}&user=${JSON.stringify({
      firstname, username, imageUrl, email
    })}`);
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
      const verify = await verifyToken(token, (err, decoded) => decoded);
      await models.User.update({ verified: true }, { where: { id: verify.id } });
      return successStat(res, 200, 'message', 'Email verified successfully');
    } catch (err) {
      return errorStat(res, 400, 'Unable to verifiy email');
    }
  }

  /**
   *  @static
    * @description Gets the logged in user's profile
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} object containing the user's profile
    * @memberof UserController
    */
  static async userProfile(req, res) {
    const { id } = req.user;
    const attributes = ['id', 'username', 'firstname', 'lastname', 'email', 'bio', 'image'];
    const userProfile = await models.User.findByPk(id, {
      attributes,
      include: [{
        model: models.User,
        through: {
          attributes: []
        },
        as: 'followers',
        attributes,
      },
      {
        model: models.User,
        through: {
          attributes: []
        },
        as: 'followings',
        attributes,
      }],
    });
    return successStat(res, 200, 'profile', {
      ...userProfile.dataValues,
      followerCount: await userProfile.countFollowers(),
      followingCount: await userProfile.countFollowings(),
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
    const { params: { username }, user } = req;
    const attributes = ['id', 'username', 'firstname', 'lastname', 'email', 'bio', 'image', 'newPostEmailSub'];
    const userProfile = await models.User.findOne({
      where: {
        username,
      },
      attributes,
      include: [{
        model: models.User,
        through: {
          attributes: []
        },
        as: 'followers',
        attributes,
      },
      {
        model: models.User,
        through: {
          attributes: []
        },
        as: 'followings',
        attributes,
      }],
    });

    if (!userProfile) return errorStat(res, 404, 'User not found');
    return successStat(res, 200, 'profile', {
      ...userProfile.dataValues,
      followerCount: await userProfile.countFollowers(),
      followingCount: await userProfile.countFollowings(),
      following: user === undefined ? undefined : await userProfile.hasFollower(user.id),
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
    const { id } = req.user;
    const {
      image, bio, email, username
    } = req.body.user;

    await models.User.update({
      image, bio, email, username,
    }, { where: { id } });

    const updatedProfile = await models.User.findByPk(id);
    return successStat(res, 200, 'profile', {
      token: await generateToken({
        id: updatedProfile.id,
        username: updatedProfile.username,
        email: updatedProfile.email
      }),
      firstname: updatedProfile.firstname,
      lastname: updatedProfile.lastname,
      username: updatedProfile.username,
      bio: updatedProfile.bio,
      image: updatedProfile.image,
    });
  }

  /**
    * @static
    * @description Allows a user to follow/unfollow another user
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} sucess message
    * @memberof UserController
    */
  static async follow(req, res) {
    const { params: { username }, user: { id }, method } = req;
    const user = await models.User.findOne({ where: { username } });
    if (!user) return errorStat(res, 404, `User with username: ${username} not found`);
    if (user.id === req.user.id) return errorStat(res, 400, `You cannot ${method === 'POST' ? '' : 'un'}follow yourself`);
    const following = await user.hasFollower(id);

    if (method === 'POST') {
      if (following) return errorStat(res, 400, `Already following ${username}`);
      await user.addFollower(id);
    } else {
      if (!following) return errorStat(res, 400, `You are not following ${username}`);
      await user.removeFollower(id);
    }

    const payload = {
      resourceType: 'follow',
      resourceId: req.user.username,
      message: `${req.user.username} just ${method === 'POST' ? '' : 'un'}followed you`,
    };
    Notification.notify([user], payload);

    return successStat(res, 200, 'message', 'successful');
  }

  /**
    * @static
    * @description Get a list of users
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @returns {Object} object containing the users
    * @memberof UserController
    */
  static async listUsers(req, res) {
    const { page, limit } = req.query;
    if (!page && !limit) {
      const users = await models.User.findAll();

      return successStat(res, 200, 'Users', users);
    }
    paginate(page, limit, models.User, 'Users', res, req);
  }

  /**
   * @static
   * @description Get a list of users
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns object response
   * @memberof UserController
   */
  static async articlesUserRead(req, res) {
    const userId = req.user.id;
    const userReadStats = await models.Reading.findAndCountAll({
      where: { userId },
      attributes: ['articleId', 'createdAt']
    });
    return successStat(res, 200, 'Articles_Read', userReadStats.count);
  }
}

export default UserController;
