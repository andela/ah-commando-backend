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
        .post(`${baseUrl}/users`)
        .send(userData[0])
        .end((err, res) => {
          const { status, user } = res.body;
          expect(status).to.equal(201);
          expect(user).to.have.property('firstname');
          expect(user).to.have.property('lastname');
          expect(user).to.have.property('email');
          expect(user).to.have.property('username');
          expect(user).to.have.property('id');
          expect(user).to.have.property('token');
          done();
        });
    });

    it('Should not register a new user if the user already exists', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[0])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(409);
          expect(error).to.equal('User Already Exists');
          done();
        });
    });
  });

  describe('test for user login', () => {
    it('Should login a user with the correct credentials', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[1])
        .end((err, res) => {
          const { status, user } = res.body;
          expect(status).to.equal(200);
          expect(user).to.have.property('firstname');
          expect(user).to.have.property('lastname');
          expect(user).to.have.property('email');
          expect(user).to.have.property('username');
          expect(user).to.have.property('id');
          expect(user).to.have.property('token');
          expect(user).to.have.property('bio');
          expect(user).to.have.property('image');
          done();
        });
    });

    it('Should not login a user with incorrect email', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[2])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Incorrect Login information');
          done();
        });
    });

    it('Should not login a user with incorrect password', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[3])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Incorrect Login information');
          done();
        });
    });
  });
});
