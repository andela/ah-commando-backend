import faker from 'faker';

const articleBody = `{"time":1567964598055,"blocks":[{"type":"paragraph","data":{"text":"${faker.lorem.paragraph()}"}}],"version":"2.15.0"}`;
const tags = ['js', 'andela', 'react', 'culture', 'sequelize', 'homely', 'travel', 'anime', 'happy'];

const articles = [{
  title: 'the title',
  articleBody,
  description: 'test description',
  tagList: 'happy',
  image: faker.image.imageUrl(),
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
  articleBody,
  description: 'test description',
  tagList: 'marriage',
  image: faker.image.imageUrl(),
  slug: 'the-title-0337485',
  readCount: 20,
  likesCount: 300,
  dislikesCount: 2000,
  readTime: 3,
  authorId: 13,
  createdAt: new Date(),
  updatedAt: new Date()
}];
for (let i = 0; i < 20; i += 1) {
  const title = faker.random.words();
  articles.push({
    title,
    articleBody,
    description: faker.lorem.sentence(),
    tagList: faker.random.arrayElement(tags),
    image: faker.image.imageUrl(),
    slug: title.split(' ').join('-') || title,
    likesCount: faker.random.number({ min: 1, max: 400 }),
    dislikesCount: faker.random.number({ min: 1, max: 400 }),
    readCount: faker.random.number({ min: 1, max: 400 }),
    authorId: faker.random.number({ min: 1, max: 12 }),
    readTime: faker.random.number({ min: 1, max: 10 }),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Articles', articles, {}),
  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
