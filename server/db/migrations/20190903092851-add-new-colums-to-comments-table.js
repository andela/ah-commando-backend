module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.addColumn('Comments', 'likesCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: '0',
    }),
    await queryInterface.addColumn('Comments', 'dislikesCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: '0',
    })
  ],

  down: async queryInterface => [
    await queryInterface.removeColumn('Comments', 'likesCount'),
    await queryInterface.removeColumn('Comments', 'dislikesCount')
  ]
};
