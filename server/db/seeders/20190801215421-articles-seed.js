'use strict';

const _ = require('lodash');
const faker = require('faker');

const tags = ['js', 'andela', 'react', 'culture', 'sequelize', 'homely', 'travel', 'anime', 'happy'];

module.exports = {
  up: (queryInterface) => {
    const randomArticles = _.times(30, () => {
      const title = faker.name.title();
      return {
        title,
        description: faker.lorem.sentence(),
        articleBody: faker.lorem.sentence(),
        uuid: faker.random.number({ max: '300' }),
        slug: title.split(' ').join('-') || title,
        image: `https://picsum.photos/${faker.random.number({ min: 1000, max: 1500 })}`,
        likesCount: faker.random.number({ min: 1, max: 99999999 }),
        dislikesCount: faker.random.number({ min: 1, max: 9999999 }),
        readCount: faker.random.number({ min: 1, max: 999999 }),
        tagList: faker.random.arrayElement(tags),
        readTime: faker.random.number({ min: 1, max: 10 }),
        authorId: faker.random.number({
          min: 1,
          max: 12
        }),
        favorited: true,
        favoriteCounts: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    return queryInterface.bulkInsert('Articles', randomArticles, {});
  },

  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
