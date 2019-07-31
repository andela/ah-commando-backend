import Authenticate from './authenticate';
import InputValidator from './inputValidator';
import { multerUploads } from './multer';

const { isLoggedIn } = Authenticate;
const { validateLogin, validateUser, validateProfileUpdate } = InputValidator;

export default {
  multerUploads,
  isLoggedIn,
  validateLogin,
  validateUser,
  validateProfileUpdate,
};
