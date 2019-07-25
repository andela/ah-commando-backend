/**
  * @Module UserController
  * @description Controlls all the user based activity
  */
class Utilites {
  /**
    * @static
    * @description Allows a user to sign up
    * @param {Object} res - Request object
    * @param {Number} status - Appropraite error statuus
    * @param {String} error - The appropriate error message
    * @returns {Object} res object to report approprate error
    * @memberof Utilites
    */
  static async errorStat(res, status, error) {
    return res.status(status).json({ status, error });
  }

  /**
    * @static
    * @description Returns message based on the status
    * @param {Object} res - Response object
    * @param {integer} status - status code to be sent
    * @param {String} key - the output data key
    * @param {Object} value - the output data values
    * @returns {Object} res object to report the appropraite message
    * @memberof Utilities
    */
  static successStat(res, status, key, value) {
    return res.status(status).json({ status, [key]: value });
  }
}

export default Utilites;
