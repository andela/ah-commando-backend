import bcrypt from 'bcryptjs';

/**
  * @Module Helper
  * @description Controlls all the user based activity
  */
class Helper {
  /**
    * @static
    * @description Allows a user to sign up
    * @param {String} password - Password to be hashed
    * @returns {String} Encrypted password
    * @memberof Helper
    */
  static hashPassword(password) {
    return bcrypt.hashSync(password, 6);
  }

  /**
    * @static
    * @description Allows a user to sign up
    * @param {String} password - Request object
    * @param {String} hashPassword - Response object
    * @returns {Boolean} Returns true if the password is correct
    * @memberof Helper
    */
  static comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  }
}

export default Helper;
