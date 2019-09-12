'use strict';

const _ = require('lodash');
const faker = require('faker');

module.exports = {
  up: (queryInterface) => {
    const articleCategories = _.times(300, () => ({
      articleId: faker.random.number({
        min: 1,
        max: 300
      }),
      categoryId: faker.random.number({
        min: 1,
        max: 9
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return queryInterface.bulkInsert('ArticleCategories', articleCategories, {});
  },

  down: queryInterface => queryInterface.bulkDelete('ArticleCategories', null, {})
};
