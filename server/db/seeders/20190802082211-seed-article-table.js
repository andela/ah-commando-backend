import faker from 'faker';

const tags = ['js', 'andela', 'react', 'culture', 'sequelize', 'homely', 'travel', 'anime', 'happy'];

const articles = [{
  title: 'the title',
  slug: 'the-title',
  articleBody: 'test article body',
  description: 'test description',
  tagList: 'happy',
  image: 'test image',
  authorId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  title: 'the title',
  slug: 'the-title',
  articleBody: 'test article body',
  description: 'test description',
  tagList: 'marriage',
  image: 'test image',
  authorId: 26,
  createdAt: new Date(),
  updatedAt: new Date()
}];
for (let i = 0; i < 20; i += 1) {
  const title = faker.random.words();
  articles.push({
    title,
    slug: title.split(' ').join('-') || title,
    articleBody: faker.lorem.text(),
    description: faker.lorem.sentence(),
    tagList: tags[Math.floor(Math.random() * tags.length)],
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
