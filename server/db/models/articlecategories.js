/* eslint-disable func-names */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const ArticleCategories = sequelize.define('ArticleCategories', {
    articleId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {});
  ArticleCategories.associate = function () {
    // associations can be defined here
  };
  return ArticleCategories;
};
