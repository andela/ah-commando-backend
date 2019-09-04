const faker = require('faker');

const comments = [];

for (let i = 0; i < 50; i += 1) {
  comments.push({
    body: faker.lorem.sentence(),
    likesCount: faker.random.number({ min: 1, max: 99999999 }),
    dislikesCount: faker.random.number({ min: 1, max: 9999999 }),
    articleId: faker.random.number({ min: 1, max: 52 }),
    highlightId: faker.random.number({ min: 1, max: 23 }),
    highlightUser: faker.random.number({ min: 1, max: 23 }),
    authorId: faker.random.number({
      min: 1,
      max: 12
    }),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

for (let i = 0; i < 50; i += 1) {
  comments.push({
    body: faker.lorem.sentence(),
    likesCount: faker.random.number({ min: 1, max: 99999999 }),
    dislikesCount: faker.random.number({ min: 1, max: 9999999 }),
    articleId: faker.random.number({ min: 1, max: 52 }),
    authorId: faker.random.number({
      min: 1,
      max: 12
    }),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Comments', comments, {}),

  down: queryInterface => queryInterface.bulkDelete('Comments', null, {})
};
