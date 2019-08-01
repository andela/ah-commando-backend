module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'following', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }),
  down: queryInterface => queryInterface.removeColumn('Users', 'following')
};
