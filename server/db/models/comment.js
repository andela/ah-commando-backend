
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: DataTypes.TEXT,
    authorId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER
  }, {});
  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, { as: 'article' });
    Comment.belongsTo(models.User, { as: 'author' });
    Comment.hasMany(models.Likes, {
      foreignKey: 'resourceId',
      timestamps: false,
      onDelete: 'CASCADE',
      scope: {
        type: 'comment'
      }
    });
  };
  return Comment;
};
