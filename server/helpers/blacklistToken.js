import cron from 'node-cron';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import models from '../db/models';

const { TokenBlacklist } = models;
/**
  * @Module TokenBlacklist
  * @description Authentication related methods
  */
class Blacklist {
  /**
   * @static
   * @param {string} token - user token
   * @returns {null} - no value
   * @memberof Blacklist
   */
  static async addToBlacklist(token) {
    const { exp } = jwt.decode(token);
    await TokenBlacklist.create({
      token,
      expires: exp
    });
  }

  /**
   * @static
   * @param {string} token - user token
   * @returns {null} - null
   * @memberof Blacklist
   */
  static async checkBlacklist(token) {
    const blacklistedToken = await TokenBlacklist.findOne({
      where: { token }
    });
    return blacklistedToken;
  }

  /* istanbul ignore next */
  /**
   * @static
   * @returns {null} - null
   * @memberof Blacklist
   */
  static async startCronJob() {
    /* starts a cron job that runs 11:59 (hours)
       everyday to clear the BlacklistToken table of expired tokens
    */
    cron.schedule('59 23 * * *', () => {
      const presentTime = Date.now().valueOf() / 1000;
      TokenBlacklist.destroy({
        where: {
          expires: {
            [Op.lt]: presentTime
          }
        }
      });
    });
  }
}

Blacklist.startCronJob();

export default Blacklist;
