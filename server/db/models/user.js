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
    newPostEmailSub: DataTypes.BOOLEAN,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    },
    isActive: DataTypes.BOOLEAN,
  }, {});
  User.associate = (models) => {
    User.belongsToMany(models.User, {
      as: 'followers',
      through: 'UserFollower',
      foreignKey: 'userId',
      otherKey: 'followerId',
      onDelete: 'CASCADE',
      hooks: true,
      timestamps: false,
    });
    User.belongsToMany(models.User, {
      as: 'followings',
      through: 'UserFollower',
      foreignKey: 'followerId',
      otherKey: 'userId',
      onDelete: 'CASCADE',
      hooks: true,
      timestamps: false,
    });
    User.hasMany(models.Article, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Bookmark, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Comment, { foreignKey: 'authorId', onDelete: 'CASCADE' });
    User.hasMany(models.Likes, {
      foreignKey: 'userId', as: 'likes', timestamps: false, onDelete: 'CASCADE'
    });
    User.hasMany(models.Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
    User.hasMany(models.Reading, {
      foreignKey: 'userId'
    });
  };
  return User;
};
