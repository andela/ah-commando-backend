module.exports = {
  up: queryInterface => queryInterface.removeColumn('Users', 'following'),
  down: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'following', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
};
