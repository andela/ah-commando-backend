import Authenticate from './authenticate';
import InputValidator from './inputValidator';

const { validateToken } = Authenticate;
const { validateLogin, validateUser } = InputValidator;

export default {
  validateToken,
  validateLogin,
  validateUser
};
