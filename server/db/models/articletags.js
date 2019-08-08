/* eslint-disable func-names */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const ArticleTags = sequelize.define('ArticleTags', {
    articleId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {});
  ArticleTags.associate = function () {
    // associations can be defined here
  };
  return ArticleTags;
};
