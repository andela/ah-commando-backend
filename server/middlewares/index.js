import Authenticate from './authenticate';
import InputValidator from './inputValidator';

const { isLoggedIn } = Authenticate;
const { validateLogin, validateUser } = InputValidator;

export default {
  isLoggedIn,
  validateLogin,
  validateUser
};
