
module.exports = (sequelize, DataTypes) => {
  const PasswordResetTokens = sequelize.define('PasswordResetTokens', {
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  PasswordResetTokens.associate = () => {
    // associations can be defined here
  };
  return PasswordResetTokens;
};
