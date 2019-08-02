module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING
    },
    articleBody: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    tagList: {
      type: Sequelize.STRING
    },
    slug: {
      type: Sequelize.STRING
    },
    favorited: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    favoriteCounts: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    uuid: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    authorId: {
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
  down: queryInterface => queryInterface.dropTable('Articles')
};
