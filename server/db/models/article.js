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
  Article.associate = function (models) {
    Article.belongsTo(models.User, { as: 'author', foreignKey: 'authorId', onDelete: 'CASCADE' });
    Article.hasMany(models.Comment, {
      foreignKey: 'articleId', onDelete: 'CASCADE', as: 'comment', hooks: true
    });
    Article.belongsTo(models.User, { foreignKey: 'authorId', onDelete: 'CASCADE' });
    Article.hasMany(models.Likes, {
      foreignKey: 'resourceId',
      timestamps: false,
      onDelete: 'CASCADE',
      scope: {
        type: 'article'
      }
    });
  };
  return Article;
};
