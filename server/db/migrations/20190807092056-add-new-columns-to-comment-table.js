'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.addColumn('Comments', 'highlightId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }),
    await queryInterface.addColumn('Comments', 'highlightUser', {
      type: Sequelize.INTEGER,
      allowNull: true
    }),
  ],

  down: async (queryInterface, Sequelize) => [
    await queryInterface.removeColumn('Comments', 'highlightId', {
      type: Sequelize.INTEGER,
      allowNull: true
    }),
    await queryInterface.removeColumn('Comments', 'highlightUser', {
      type: Sequelize.INTEGER,
      allowNull: true
    }),
  ],
};
