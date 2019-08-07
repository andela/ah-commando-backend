import Authenticate from './authenticate';
import InputValidator from './inputValidator';
import { multerUploads } from './multer';

const { verifyToken, optionalLogin } = Authenticate;
const {
  validateLogin,
  validateUser,
  validateArticle,
  validateProfileUpdate,
  validatePasswordReset,
  validateEmail,
  validateCommentMessage,
  validateLikes
} = InputValidator;

export default {
  multerUploads,
  verifyToken,
  validateLogin,
  validateUser,
  validateProfileUpdate,
  validateArticle,
  validatePasswordReset,
  validateEmail,
  optionalLogin,
  validateCommentMessage,
  validateLikes
};
