import Authenticate from './authenticate';
import InputValidator from './inputValidator';
import { multerUploads } from './multer';

const { verifyToken } = Authenticate;
const { validateLogin, validateUser, validateProfileUpdate } = InputValidator;

export default {
  multerUploads,
  verifyToken,
  validateLogin,
  validateUser,
  validateProfileUpdate,
};
