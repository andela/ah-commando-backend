import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';

describe('Social signin test', () => {
  it('Should display user details on success login', (done) => {
    const user = JSON.stringify({
      name: ['test testlastname'],
      email: 'testemail',
      picture: 'testimage.jpg',
      email_verified: true,
    });
    chai.request(app)
      .get(`${baseUrl}/users/google/callback?user=${user}`)
      .end((err, res) => {
        const { body: { status } } = res;
        expect(status).to.equal(200);
        done();
      });
  });

  // it('Should return 404 user is not found', (done) => {
  //   const user = null;
  //   chai.request(app)
  //     .get(`${baseUrl}/users/google/callback?user=${user}`)
  //     .end((err, res) => {
  //       const { body: { message, status } } = res;
  //       expect(status).to.equal(404);
  //       expect(message).to.be.a('string');
  //       expect(message).to.equal('Account not found');
  //       done();
  //     });
  // });
});
