module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserFollower', {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE'
    },
    followerId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE'
    },
  }),
  down: queryInterface => queryInterface.dropTable('UserFollower')
};
