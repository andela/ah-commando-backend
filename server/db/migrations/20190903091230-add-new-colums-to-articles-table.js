module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.addColumn('Articles', 'likesCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: '0',
    }),
    await queryInterface.addColumn('Articles', 'dislikesCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: '0',
    })
  ],

  down: async queryInterface => [
    await queryInterface.removeColumn('Articles', 'likesCount'),
    await queryInterface.removeColumn('Articles', 'dislikesCount')
  ]
};
