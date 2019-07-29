'use strict';

module.exports = (sequelize, DataTypes) => {
  const TokenBlacklist = sequelize.define('TokenBlacklist', {
    token: DataTypes.STRING,
    expires: DataTypes.BIGINT
  }, {});
  return TokenBlacklist;
};
