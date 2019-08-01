import utils from './Utilities';
import { uploader } from '../db/config/cloudinaryConfig';
import { dataUri } from '../middlewares/multer';

const { successStat } = utils;

/**
  * @Module ImageUpload
  * @description Handles Image upload
  */
class ImageUpload {
/**
   * @description Upload an Image
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns the uploaded image url
   * @memberof ImageUpload
   */
  static async uploadImage(req, res) {
    const file = dataUri(req).content;
    const uploadedImage = await uploader.upload(file);
    return successStat(res, 200, 'image', uploadedImage.url);
  }
}
export default ImageUpload;
