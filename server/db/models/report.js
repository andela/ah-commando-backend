module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    reportDetails: DataTypes.STRING,
    reportType: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER
  }, {});
  Report.associate = (models) => {
    Report.belongsTo(models.Article, { foreignKey: 'articleId' });
    Report.belongsTo(models.User, { as: 'author', foreignKey: 'authorId' });
  };
  return Report;
};
