
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: DataTypes.TEXT,
    authorId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER
  }, {});
  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, { as: 'article' });
    Comment.belongsTo(models.User, { as: 'author' });
  };
  return Comment;
};
