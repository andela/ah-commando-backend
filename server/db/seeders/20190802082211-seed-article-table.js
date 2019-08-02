import faker from 'faker';

const articles = [];
for (let i = 0; i < 20; i += 1) {
  articles.push({
    title: faker.random.words(),
    articleBody: faker.lorem.text(),
    description: faker.lorem.sentence(),
    tagList: faker.random.words(),
    image: faker.random.image(),
    authorId: faker.random.number({ min: 1, max: 20 }),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Articles', articles, {}),

  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
