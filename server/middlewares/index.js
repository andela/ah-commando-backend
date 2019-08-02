import Authenticate from './authenticate';
import InputValidator from './inputValidator';
import { multerUploads } from './multer';

const { verifyToken, optionalLogin } = Authenticate;
const {
  validateLogin, validateUser, validateProfileUpdate, validatePasswordReset,
  validateEmail,
} = InputValidator;

export default {
  multerUploads,
  verifyToken,
  validateLogin,
  validateUser,
  validateProfileUpdate,
  validatePasswordReset,
  validateEmail,
  optionalLogin,
};
