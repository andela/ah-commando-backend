
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('DeletedUsers', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstname: {
      type: Sequelize.STRING
    },
    lastname: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    socialId: {
      type: Sequelize.STRING
    },
    verified: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    role: {
      allowNull: false,
      type: Sequelize.STRING
    },
    isActive: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
    }
  }),
  down: queryInterface => queryInterface.dropTable('DeletedUsers')
};
