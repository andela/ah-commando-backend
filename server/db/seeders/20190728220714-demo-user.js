/* eslint-disable require-jsdoc */
import Helper from '../../helpers/passwordHash';

const password = Helper.hashPassword('PassWord123...');

module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Users', [
      {
        firstname: 'Dominic',
        lastname: 'Isioma',
        email: 'dominicisioma000@gmail.com',
        password,
        username: 'encodedBicoding',
        createdAt: new Date(),
        updatedAt: new Date(),
        image: null,
        bio: null,
      },
    ], {}
  ),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
