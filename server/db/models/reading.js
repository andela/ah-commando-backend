module.exports = (sequelize, DataTypes) => {
  const Reading = sequelize.define('Reading', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
  }, {});
  Reading.associate = (models) => {
    Reading.belongsTo(models.User, {
      foreignkey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
    Reading.belongsTo(models.Article, {
      foreignkey: 'articleId',
      as: 'article',
      onDelete: 'CASCADE',
    });
  };
  return Reading;
};
