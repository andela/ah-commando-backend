module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    articleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    ratings: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {});
  Rating.associate = (models) => {
    // associations can be defined here
    Rating.belongsTo(models.User, {
      foreignKey: 'id',
      as: 'user',
      timestamps: false
    });
    Rating.belongsTo(models.Article, {
      foreignKey: 'id',
      as: 'article',
      cascade: true,
      timestamps: false
    });
  };
  return Rating;
};
