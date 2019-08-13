module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.addColumn('Articles', 'readCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: '0',
    }),
  ],

  down: async queryInterface => [
    await queryInterface.removeColumn('Articles', 'readCount'),
  ]
};
