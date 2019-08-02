module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.addColumn('Users', 'socialId', {
      type: Sequelize.STRING,
      allowNull: true
    }),
    await queryInterface.addColumn('Users', 'verified', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    }),
  ],

  down: async queryInterface => [
    await queryInterface.removeColumn('Users', 'socialId'),
    await queryInterface.removeColumn('Users', 'verified'),
  ]
};
