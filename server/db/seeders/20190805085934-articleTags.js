'use strict';

const _ = require('lodash');
const faker = require('faker');

module.exports = {
  up: (queryInterface) => {
    const articleCategories = _.times(52, () => ({
      articleId: faker.random.number({
        min: 1,
        max: 30
      }),
      tagId: faker.random.number({
        min: 1,
        max: 9
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return queryInterface.bulkInsert('ArticleTags', articleCategories, {});
  },

  down: queryInterface => queryInterface.bulkDelete('ArticleTags', null, {})
};
