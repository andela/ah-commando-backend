import utilities from '../helpers';
import auth from '../helpers/auth';
import models from '../db/models';

const { errorStat, checkBlacklist } = utilities;

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
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return errorStat(res, 401, 'Authorization error');
    const token = req.headers.authorization.split(' ')[1] || authorizationHeader;
    const verify = await auth.verifyToken(token, async (err, decoded) => {
      if (err) {
        return errorStat(res, 401, 'invalid token');
      }
      const blacklist = await checkBlacklist(token);
      if (blacklist) {
        return errorStat(res, 401, 'invalid token');
      }
      return decoded;
    });
    const { id } = verify;
    const loggedInUser = await models.User.findByPk(id);

    req.loggedInUser = loggedInUser.dataValues;
    next();
  }
}

export default Authenticate;
