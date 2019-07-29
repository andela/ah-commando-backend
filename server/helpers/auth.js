import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();
const secret = process.env.SECRET_KEY;

/**
  * @Module Auth
  * @description Authentication related methods
  */
class Auth {
  /**
    * @description Generates a jwt token
    * @param {Object} payload - Details to encode in the token
    * @returns {string} Generated token
    * @memberof Auth
    */
  static generateToken(payload) {
    const token = jwt.sign(payload, secret, { expiresIn: 86400 });
    return token;
  }

  /**
    * @description Generates a jwt token
    * @param {Object} token - Details to encode in the token
    * @returns {Object} verified token
    * @memberof Auth
    */
  static verifyToken(token) {
    return jwt.verify(token, secret);
  }
}

export default Auth;
