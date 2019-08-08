module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    likes: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    resourceId: DataTypes.INTEGER,
    type: DataTypes.STRING,
  }, {});
  Likes.associate = (models) => {
    Likes.belongsTo(models.User, { foreignKey: 'userId', timestamps: false, onDelete: 'CASCADE' });
    Likes.belongsTo(models.Article, {
      foreignKey: 'resourceId', timestamps: false, onDelete: 'CASCADE'
    });
    Likes.belongsTo(models.Comment, {
      foreignKey: 'resourceId', timestamps: false, onDelete: 'CASCADE'
    });
  };
  return Likes;
};
