import blacklistToken from './blacklistToken';
import Auth from './auth';
import passwordHash from './passwordHash';
import Utilities from './Utilities';
import Mail from './mail/mail';
import articleSearch from './articleSearch';
import Paginate from './paginate';

import tagCategory from './tag_categoryHelper';

const { generateToken, verifyToken, encryptQuery } = Auth;
const { hashPassword, comparePassword } = passwordHash;
const { errorStat, successStat } = Utilities;
const { addToBlacklist, checkBlacklist } = blacklistToken;
const { querySearch, filterSearch } = articleSearch;
const { paginate } = Paginate;
const { addTags, addCategories } = tagCategory;

export default {
  addToBlacklist,
  checkBlacklist,
  generateToken,
  hashPassword,
  comparePassword,
  errorStat,
  successStat,
  verifyToken,
  Mail,
  querySearch,
  filterSearch,
  paginate,
  addTags,
  addCategories,
  encryptQuery
};
