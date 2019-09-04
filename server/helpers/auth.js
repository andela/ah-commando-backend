import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import Cryptr from 'cryptr';

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
    * @description Verify a jwt token
    * @param {Object} token - Token to be verified
    *  @param {function} callBack - call back method to jwt
    * @returns {Object} verified token
    * @memberof Auth
    */
  static async verifyToken(token, callBack) {
    return jwt.verify(token, secret, callBack);
  }

  /**
    * @description Encrypt a jwt token
    * @param {String} string - Token to be verified
    *  @param {function} callBack - call back method to jwt
    * @returns {Object} verified token
    * @memberof Auth
    */
  static async encryptQuery(string) {
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const encryptedString = await cryptr.encrypt(string);
    return encryptedString;
  }
}

export default Auth;
