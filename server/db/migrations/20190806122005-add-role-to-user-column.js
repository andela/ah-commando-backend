module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.addColumn('Users', 'role', {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: 'user'
    }),
    await queryInterface.addColumn('Users', 'isActive', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }),
  ],
  down: async queryInterface => [
    await queryInterface.removeColumn('Users', 'role'),
    await queryInterface.removeColumn('Users', 'isActive')
  ]
};
