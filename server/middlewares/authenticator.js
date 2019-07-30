import utils from '../helpers/Utilities';
import Auth from '../helpers/auth';
import models from '../db/models';


/**
  * @Module Authenticate
  * @description Authentication related methods
  */
class Authenticate {
  /**
       * @static
       * @description Authenticate the routes
       * @param {object} req - Request object
       * @param {object} res - Response object
       * @param {Object} next - Next function call
       * @returns {object} Json
       * @memberof Authenticate
       */
  static async isLoggedIn(req, res, next) {
    const receivedToken = req.headers.authorization;
    if (!receivedToken) return utils.errorStat(res, 401, 'Authorization error');

    const token = receivedToken.split(' ')[1];
    const verifiedToken = Auth.verifyToken(token);
    const { id } = verifiedToken;

    const loggedInUser = await models.User.findByPk(id);

    req.loggedInUser = loggedInUser.dataValues;

    return next();
  }
}

export default Authenticate;
