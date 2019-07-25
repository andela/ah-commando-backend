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
}

export default Auth;
