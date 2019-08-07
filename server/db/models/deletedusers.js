
module.exports = (sequelize, DataTypes) => {
  const DeletedUsers = sequelize.define('DeletedUsers', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    username: DataTypes.STRING,
    image: DataTypes.STRING,
    socialId: DataTypes.STRING,
    verified: DataTypes.STRING,
    role: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  DeletedUsers.associate = () => {
    // associations can be defined here
  };
  return DeletedUsers;
};
