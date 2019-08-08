module.exports = {
  up: queryInterface => queryInterface.bulkInsert('UserFollower', [
    {
      userId: 1,
      followerId: 2,
    },
    {
      userId: 1,
      followerId: 4,
    },
    {
      userId: 1,
      followerId: 5,
    },
    {
      userId: 1,
      followerId: 6,
    },
    {
      userId: 1,
      followerId: 7,
    },
    {
      userId: 1,
      followerId: 8,
    },
    {
      userId: 1,
      followerId: 9,
    },
    {
      userId: 1,
      followerId: 10,
    },
  ]),
  down: queryInterface => queryInterface.dropAllTables()
};
