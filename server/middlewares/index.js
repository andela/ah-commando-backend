import Authenticate from './authenticate';
import InputValidator from './inputValidator';
import { multerUploads } from './multer';
import searchValidator from './searchValidator';

const { validateFilter, validateKeyword } = searchValidator;
const {
  verifyToken, optionalLogin, isActive, isJustAUser
} = Authenticate;
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
  validateReportArticle,
  validateHighlightData,
  validateGetHighlight,
  validateRoleInput,
  validateParamsInput
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
  isJustAUser,
  optionalLogin,
  validateCommentMessage,
  validateFilter,
  validateKeyword,
  validateLikes,
  validateId,
  validateReportArticle,
  validateHighlightData,
  validateGetHighlight,
  isActive,
  validateRoleInput,
  validateParamsInput
};
