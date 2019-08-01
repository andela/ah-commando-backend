import blacklistToken from './blacklistToken';
import Auth from './auth';
import passwordHash from './passwordHash';
import Utilities from './Utilities';
import Mail from './mail/mail';

const { generateToken, verifyToken } = Auth;
const { hashPassword, comparePassword } = passwordHash;
const { errorStat, successStat } = Utilities;
const { addToBlacklist, checkBlacklist } = blacklistToken;

export default {
  addToBlacklist,
  checkBlacklist,
  generateToken,
  hashPassword,
  comparePassword,
  errorStat,
  successStat,
  verifyToken,
  Mail
};
