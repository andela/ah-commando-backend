module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Likes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      type: Sequelize.INTEGER
    },
    likes: {
      type: Sequelize.BOOLEAN
    },
    userId: {
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    articleId: {
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Likes')
};
