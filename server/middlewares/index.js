import Authenticate from './authenticate';
import InputValidator from './inputValidator';
import { multerUploads } from './multer';
import searchValidator from './searchValidator';

const { verifyToken, optionalLogin } = Authenticate;
const { validateFilter, validateKeyword } = searchValidator;
const {
  validateLogin,
  validateUser,
  validateArticle,
  validateProfileUpdate,
  validatePasswordReset,
  validateEmail,
  validateCommentMessage,
  validateLikes,
  validateId,
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
  validateFilter,
  validateKeyword,
  validateLikes,
  validateId,
};
