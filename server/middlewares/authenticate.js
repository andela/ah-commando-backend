import jwt from 'jsonwebtoken';
import utilities from '../helpers';

const secret = process.env.SECRET_KEY;
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
  static async validateToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    const token = req.headers.authorization.split(' ')[1] || authorizationHeader;
    if (!token) return errorStat(res, 401, 'Authorization error');
    jwt.verify(token, secret, async (err) => {
      if (err) {
        const message = (err.name === 'TokenExpiredError') ? 'token expired' : 'invalid token';
        return errorStat(res, 401, message);
      }
      const blacklist = await checkBlacklist(token);
      if (blacklist) {
        return errorStat(res, 401, 'invalid token');
      }
      next();
    });
  }
}

export default Authenticate;
