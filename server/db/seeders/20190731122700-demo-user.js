module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [
    {
      firstname: 'john',
      lastname: 'doe',
      username: 'j_doe23',
      email: 'john.doe@test.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstname: 'kafilat',
      lastname: 'abdulwahab',
      username: 'kafee',
      email: 'kafee@test.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstname: 'dominic',
      lastname: 'olije',
      username: 'dom_ee_neek',
      email: 'react.dom@test.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstname: 'martins',
      lastname: 'obayomi',
      username: 'obo_baddest',
      email: 'martins_gee@test.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstname: 'jude',
      lastname: 'chinonso',
      username: 'cvjude',
      email: 'jude.violet@test.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstname: 'pelumi',
      lastname: 'aleshinloye',
      username: 'alesh_w',
      email: 'alesh.lukmon@test.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstname: 'chukwudi',
      lastname: 'ngwobia',
      username: 'chuxmyk',
      email: 'ngwobiachukwudi@gmail.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstname: 'malik',
      lastname: 'godwin',
      username: 'maleek_berry',
      email: 'malik.godwin@test.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstname: 'nonso',
      lastname: 'igwe',
      username: 'chiboy_calix',
      email: 'calix_boy@test.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstname: 'monday',
      lastname: 'onu',
      username: 'lundii',
      email: 'onu.monday@test.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstname: 'follower',
      lastname: 'followee',
      username: 'test_fellow',
      email: 'follow.follow@test.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstname: 'Dominic',
      lastname: 'Isioma',
      username: 'encodedBicoding',
      email: 'dominicisioma000@gmail.com',
      password: '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
      image: null,
      bio: null,
      newPostEmailSub: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: queryInterface => queryInterface.dropAllTables()
};
