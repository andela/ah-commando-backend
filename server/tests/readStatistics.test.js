import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

const baseUrl = '/api/v1';
let userToken;

describe('User statistics test', () => {
  before((done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users`)
      .send({
        user: {
          firstname: 'User',
          lastname: 'lastname',
          username: 'stat_user1',
          email: 'statistics@mail.com',
          password: 'P@ssw0rd123'
        }
      })
      .end((err, res) => {
        const {
          user: { token }
        } = res.body;
        userToken = token;
        done();
      });
  });

  it('should return user read statistics', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/user/readStat`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });
});
