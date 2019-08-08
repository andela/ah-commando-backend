/* eslint-disable func-names */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define('Categories', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Categories.associate = function (models) {
    Categories.belongsToMany(models.Article, {
      through: 'ArticleCategories',
      foreignKey: 'categoryId'
    });
  };
  return Categories;
};
