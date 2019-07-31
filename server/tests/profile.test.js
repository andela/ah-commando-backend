/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import path from 'path';
import app from '../index';
import userData from './testData/user.data';
import { uploader } from '../db/config/cloudinaryConfig';

const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';
let upload;
let userToken;


before((done) => {
  upload = sinon.stub(uploader, 'upload').returns(() => { });
  chai.request(app)
    .post(`${baseUrl}/users`)
    .send(userData[18])
    .end((err, res) => {
      const { user: { token } } = res.body;
      userToken = token;
      done();
    });
});

after(() => {
  upload.restore();
});

describe('Profile Test', () => {
  it('Should get own profile of the authorized user', (done) => {
    chai.request(app)
      .get(`${baseUrl}/user`)
      .set('authorization', `Bearer ${userToken}`)
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

  it('Should give authorization error if token is invalid', (done) => {
    chai.request(app)
      .get(`${baseUrl}/user`)
      .set('authorization', 'Bearer invalid')
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(401);
        expect(error).to.equal('invalid token');
        done();
      });
  });

  it('Should get a user\'s profile', (done) => {
    chai.request(app)
      .get(`${baseUrl}/profiles/testprofile`)
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

  it('Should edit profile of the authorized user', (done) => {
    chai.request(app)
      .put(`${baseUrl}/user`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        user: {
          username: 'metest',
          email: 'new@test.com',
          bio: 'I am testing new bio',
          image: 'http://res.cloudinary.com/kafee/image/upload/v1564568639/luleidouer2w8vdi1yoc.png'
        }
      })
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });

  it('Should throw error if the username and email does not meet the requirement', (done) => {
    chai.request(app)
      .put(`${baseUrl}/user`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        user: {
          email: 'new@test',
          username: 'a@b'
        }
      })
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(400);
        done();
      });
  });

  it('Should throw error if the username is empty', (done) => {
    chai.request(app)
      .put(`${baseUrl}/user`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        user: {
          username: ''
        }
      })
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(400);
        done();
      });
  });

  it('Should upload image of the authorized user', (done) => {
    chai.request(app)
      .post(`${baseUrl}/image`)
      .set('authorization', `Bearer ${userToken}`)
      .set('Content-Type', 'multipart/form-data')
      .attach('image', path.join(__dirname, './testData/img/test.png'))
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });
});
