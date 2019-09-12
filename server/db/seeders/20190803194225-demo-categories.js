'use strict';

const faker = require('faker');

const categories = ['technology', 'health', 'science', 'fashion', 'education', 'culture', 'lifestyle', 'travel', 'nature'];

module.exports = {
  up: (queryInterface) => {
    const randomCategories = categories.map(item => ({
      name: item,
      description: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return queryInterface.bulkInsert('Categories', randomCategories, {});
  },

  down: queryInterface => queryInterface.bulkDelete('Categories', null, {})
};
