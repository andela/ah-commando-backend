'use strict';

const _ = require('lodash');
const faker = require('faker');

module.exports = {
  up: (queryInterface) => {
    const articleCategories = _.times(30, () => ({
      articleId: faker.random.number({
        min: 1,
        max: 52
      }),
      categoryId: faker.random.number({
        min: 1,
        max: 7
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return queryInterface.bulkInsert('ArticleCategories', articleCategories, {});
  },

  down: queryInterface => queryInterface.bulkDelete('ArticleCategories', null, {})
};
