import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import userData from './testData/user.data';

const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';

describe('User tests', () => {
  describe('test for user signup', () => {
    it('Should register a user when all required input is supplied', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
        .send(userData[0])
        .end((err, res) => {
          const { status, user } = res.body;
          expect(status).to.equal(201);
          expect(user).to.have.property('firstname');
          expect(user).to.have.property('lastname');
          expect(user).to.have.property('email');
          expect(user).to.have.property('username');
          done();
        });
    });

    it('Should not register a new user if the user already exists', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
        .send(userData[0])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(409);
          expect(error).to.equal('User Already Exists');
          done();
        });
    });
  });
});
