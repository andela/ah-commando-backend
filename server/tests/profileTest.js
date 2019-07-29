/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import userData from './testData/user.data';

const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';

describe('Profile Test', () => {
  it('Should get own profile of the authorized user', (done) => {
    chai.request(app)
      .post(`${baseUrl}/users`)
      .send(userData[4])
      .end((authErr, authRes) => {
        const { token } = authRes.body.user;
        chai.request(app)
          .get(`${baseUrl}/user`)
          .set('authorization', `Bearer ${token}`)
          .end((err, res) => {
            const { status, profile } = res.body;
            expect(status).to.equal(200);
            expect(profile).to.have.property('username');
            expect(profile).to.have.property('bio');
            expect(profile).to.have.property('image');
            expect(profile).to.have.property('following');
            done();
          });
      });
  });
});
