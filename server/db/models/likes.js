module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    likes: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER
  }, {});
  Likes.associate = (models) => {
    Likes.belongsTo(models.User, { foreignKey: 'userId', timestamps: false, onDelete: 'CASCADE' });
    Likes.belongsTo(models.Article, {
      foreignKey: 'articleId', as: 'Article', timestamps: false, onDelete: 'CASCADE'
    });
  };
  return Likes;
};
