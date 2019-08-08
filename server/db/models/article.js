/* eslint-disable func-names */
import SequelizeSlugify from 'sequelize-slugify';

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      title: DataTypes.STRING,
      articleBody: DataTypes.STRING,
      description: DataTypes.STRING,
      tagList: DataTypes.STRING,
      uuid: DataTypes.STRING,
      slug: {
        type: DataTypes.STRING,
        unique: true
      },
      readTime: DataTypes.INTEGER,
      favorited: DataTypes.BOOLEAN,
      favoriteCounts: DataTypes.INTEGER,
      image: DataTypes.STRING,
      authorId: DataTypes.INTEGER
    },
    {}
  );

  SequelizeSlugify.slugifyModel(Article, {
    source: ['title'],
    suffixSource: ['uuid'],
    slugOptions: { lower: true }
  });
  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    Article.hasMany(models.Bookmark, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Article.belongsTo(models.User, { as: 'author', foreignKey: 'authorId', onDelete: 'CASCADE' });
    Article.hasMany(models.Comment, {
      foreignKey: 'articleId', onDelete: 'CASCADE', as: 'comment', hooks: true
    });
    Article.belongsToMany(models.Categories, {
      through: 'ArticleCategories',
      foreignKey: 'articleId'
    });
    Article.belongsToMany(models.Tags, {
      through: 'ArticleTags',
      foreignKey: 'articleId'
    });
    Article.belongsTo(models.User, { foreignKey: 'authorId', onDelete: 'CASCADE' });
    Article.hasMany(models.Likes, { foreignKey: 'articleId', timestamps: false, onDelete: 'CASCADE' });
  };
  return Article;
};
