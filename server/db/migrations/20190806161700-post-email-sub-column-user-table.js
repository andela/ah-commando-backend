module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'newPostEmailSub', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }),
  down: queryInterface => queryInterface.removeColumn('Users', 'newPostEmailSub')
};
