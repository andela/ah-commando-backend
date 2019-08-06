'use strict';

const _ = require('lodash');
const faker = require('faker');

module.exports = {
  up: (queryInterface) => {
    const randomArticles = _.times(30, () => ({
      title: faker.name.title(),
      description: faker.lorem.sentence(),
      articleBody: faker.lorem.sentence(),
      uuid: faker.random.number({ max: '300' }),
      slug: faker.lorem.words(),
      image: faker.lorem.sentence(),
      authorId: faker.random.number({
        min: 1,
        max: 12
      }),
      favorited: true,
      favoriteCounts: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    return queryInterface.bulkInsert('Articles', randomArticles, {});
  },

  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
