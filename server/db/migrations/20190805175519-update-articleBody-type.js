'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .changeColumn('Articles', 'articleBody', {
      type: Sequelize.TEXT,
      allowNull: false
    }),

  down: (queryInterface, Sequelize) => queryInterface
    .changeColumn('Articles', 'articleBody', {
      type: Sequelize.TEXT,
      allowNull: false
    }),
};
