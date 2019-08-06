
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Comments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    authorId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    articleId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }),
  down: queryInterface => queryInterface.dropTable('Comments')
};
