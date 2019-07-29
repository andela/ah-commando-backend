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

  it('Should give authorization error if token is not supplied', (done) => {
    chai.request(app)
      .get(`${baseUrl}/user`)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(401);
        expect(error).to.equal('Authorization error');
        done();
      });
  });

  it('Should get a user\'s profile', (done) => {
    chai.request(app)
      .get(`${baseUrl}/profiles/testProfile`)
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

  it('Should give error if user\'s profile is not found', (done) => {
    chai.request(app)
      .get(`${baseUrl}/profiles/test`)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(404);
        expect(error).to.equal('No user found');
        done();
      });
  });
});
