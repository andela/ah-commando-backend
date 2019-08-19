import Authenticate from './authenticate';
import InputValidator from './inputValidator';
import { multerUploads } from './multer';
import searchValidator from './searchValidator';
import paymentValidator from './paymentValidator';

const { validateFilter, validateKeyword } = searchValidator;
const {
  validateSubscription, validateUnSubscribe, validateCreateToken, validatePlan,
  validateDeletePlan
} = paymentValidator;
const {
  verifyToken, optionalLogin, isActive, isJustAUser
} = Authenticate;
const {
  validateLogin,
  validateUser,
  validateNewUser,
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
  validateParamsInput,
  validateUpdateUser,
  validateGetUser
} = InputValidator;

export default {
  multerUploads,
  verifyToken,
  validateLogin,
  validateUser,
  validateNewUser,
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
  validateParamsInput,
  validateUpdateUser,
  validateGetUser,
  validateSubscription,
  validateUnSubscribe,
  validateCreateToken,
  validatePlan,
  validateDeletePlan
};
