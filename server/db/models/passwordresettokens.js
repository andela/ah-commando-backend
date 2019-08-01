
module.exports = (sequelize, DataTypes) => {
  const PasswordResetTokens = sequelize.define('PasswordResetTokens', {
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    email: DataTypes.STRING
  }, {});
  PasswordResetTokens.associate = () => {
    // associations can be defined here
  };
  return PasswordResetTokens;
};
