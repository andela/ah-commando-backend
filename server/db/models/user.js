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
    verified: DataTypes.BOOLEAN,
    following: DataTypes.BOOLEAN,
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Article, { foreignKey: 'authorId', onDelete: 'CASCADE', timestamps: false });
    User.hasMany(models.Rating, {
      foreignKey: 'userId', as: 'rating', timestamps: false, onDelete: 'CASCADE'
    });
  };
  return User;
};
