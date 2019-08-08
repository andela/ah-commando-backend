module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    userId: DataTypes.INTEGER,
    resourceType: DataTypes.STRING,
    resourceId: DataTypes.STRING,
    message: DataTypes.STRING,
    read: DataTypes.BOOLEAN,
  }, {});
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      as: 'userNotification',
      foreignKey: 'userId',
    });
  };
  return Notification;
};
