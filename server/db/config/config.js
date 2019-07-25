const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL'
  },
  test: {
    use_env_valriable: 'TEST_DATABASE_URL'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};
