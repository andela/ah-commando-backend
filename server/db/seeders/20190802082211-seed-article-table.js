import faker from 'faker';

const tags = ['js', 'andela', 'react', 'culture', 'sequelize', 'homely', 'travel', 'anime', 'happy'];

const articles = [{
  title: 'the title',
  articleBody: 'test article body',
  description: 'test description',
  tagList: 'happy',
  image: 'test image',
  slug: 'the-title',
  readCount: 20,
  likesCount: 200,
  dislikesCount: 30,
  readTime: 3,
  authorId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  title: 'the title',
  articleBody: 'test article body',
  description: 'test description',
  tagList: 'marriage',
  image: 'test image',
  slug: 'the-title-0337485',
  readCount: 20,
  likesCount: 300,
  dislikesCount: 2000,
  readTime: 3,
  authorId: 26,
  createdAt: new Date(),
  updatedAt: new Date()
}];
for (let i = 0; i < 20; i += 1) {
  const title = faker.random.words();
  articles.push({
    title,
    articleBody: faker.lorem.text(),
    description: faker.lorem.sentence(),
    tagList: faker.random.arrayElement(tags),
    image: faker.random.image(),
    slug: title.split(' ').join('-') || title,
    likesCount: faker.random.number({ min: 1, max: 99999999 }),
    dislikesCount: faker.random.number({ min: 1, max: 9999999 }),
    readCount: faker.random.number({ min: 1, max: 999999 }),
    authorId: faker.random.number({ min: 1, max: 15 }),
    readTime: faker.random.number({ min: 1, max: 10 }),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Articles', articles, {}),
  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
