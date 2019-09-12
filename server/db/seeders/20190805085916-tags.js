'use strict';

const faker = require('faker');

const tags = ['javascript', 'AI', 'travel', 'peace', 'believe', 'race', 'react', 'tutorial', 'knowledge', 'andela', 'js'];
module.exports = {
  up: (queryInterface) => {
    const randomCategories = tags.map(item => ({
      name: item,
      description: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return queryInterface.bulkInsert('Tags', randomCategories, {});
  },

  down: queryInterface => queryInterface.bulkDelete('Tags', null, {})
};
