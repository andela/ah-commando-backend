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
  static async verifyToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return errorStat(res, 401, 'Authorization error');
    const token = req.headers.authorization.split(' ')[1] || authorizationHeader;
    let verifiedUser;
    try {
      verifiedUser = await auth.verifyToken(token, async (err, decoded) => {
        if (err) {
          throw new Error();
        }
        const blacklist = await checkBlacklist(token);
        if (blacklist) {
          throw new Error();
        }
        return decoded;
      });
    } catch (err) {
      return errorStat(res, 401, 'invalid token');
    }
    const { id } = verifiedUser;
    const user = await models.User.findByPk(id);
    if (!user) {
      return errorStat(res, 404, 'user not found');
    }
    req.user = user.dataValues;
    next();
  }

  /**
   * @static
   * @description Gets user details if the user is logged in. But returns next with
   * no details if the user is not logged in
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {Object} next - Next function call
   * @returns {object} Json
   * @memberof Authenticate
   */
  static async optionalLogin(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return next();
    return Authenticate.verifyToken(req, res, next);
  }
}

export default Authenticate;
