/* eslint-disable func-names */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define('Tags', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Tags.associate = function (models) {
    Tags.belongsToMany(models.Article, {
      through: 'ArticleTags',
      foreignKey: 'tagId'
    });
  };
  return Tags;
};
