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
      authorId: DataTypes.INTEGER,
      likesCount: DataTypes.INTEGER,
      dislikesCount: DataTypes.INTEGER,
      readCount: {
        type: DataTypes.INTEGER,
        defaultValue: '0',
      },
    },
  );

  SequelizeSlugify.slugifyModel(Article, {
    source: ['title'],
    suffixSource: ['uuid'],
    slugOptions: { lower: true }
  });
  Article.associate = (models) => {
    Article.hasMany(models.Bookmark, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Article.belongsTo(models.User, { as: 'author', foreignKey: 'authorId', onDelete: 'CASCADE' });
    Article.hasMany(models.Comment, {
      foreignKey: 'articleId', onDelete: 'CASCADE', as: 'comment', hooks: true
    });
    Article.hasMany(models.Likes, {
      foreignKey: 'resourceId',
      timestamps: false,
      onDelete: 'CASCADE',
      scope: {
        type: 'article'
      }
    });
    Article.belongsToMany(models.Categories, {
      through: 'ArticleCategories',
      foreignKey: 'articleId'
    });
    Article.belongsToMany(models.Tags, {
      through: 'ArticleTags',
      foreignKey: 'articleId'
    });
    Article.hasMany(models.Reading, {
      foreignKey: 'articleId'
    });
  };
  return Article;
};
