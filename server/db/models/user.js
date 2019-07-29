module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    bio: DataTypes.STRING,
    image: DataTypes.STRING,
    socialId: DataTypes.STRING,
    verified: DataTypes.BOOLEAN
  }, {});
  User.associate = () => {
    // associations can be defined here
  };
  return User;
};
