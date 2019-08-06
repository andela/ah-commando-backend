module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.addColumn('Articles', 'readTime', {
      type: Sequelize.INTEGER,
      allowNull: false
    }),
  ],

  down: async queryInterface => [
    await queryInterface.removeColumn('Articles', 'readTime'),
  ]
};
