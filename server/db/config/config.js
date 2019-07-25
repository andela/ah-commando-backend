const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    logging: false,
    dialect: 'postgres'
  },
  test: {
    use_env_valriable: 'TEST_DATABASE_URL',
    logging: false,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    logging: false,
    dialect: 'postgres'
  }
};
