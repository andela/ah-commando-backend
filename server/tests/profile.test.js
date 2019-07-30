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
const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlcm5hbWUiLCJlbWFpbCI6InRlc3RAdGVzdGRvbWFpbi50ZXN0Y29tIiwiaWF0IjoxNTY0NDgwNjM5LCJleHAiOjE1NjQ0ODA2NDB9.TsuwwCFHdaGvCCxZrfAQgP8RbfErBr6MQhHRqMT9JuE';

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

  it('Should give authorization error if token is expired', (done) => {
    chai.request(app)
      .get(`${baseUrl}/user`)
      .set('authorization', `Bearer ${expiredToken}`)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(401);
        expect(error).to.equal('token expired');
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
      .set('Content-Type', 'multipart/form-data')
      .field({
        email: 'new@test.com',
        bio: 'I am testing new bio'
      })
      .attach('image', path.join(__dirname, './testData/img/test.png'))
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });

  it('Should return an error if an image is not found', (done) => {
    chai.request(app)
      .put(`${baseUrl}/user`)
      .set('authorization', `Bearer ${userToken}`)
      .set('Content-Type', 'multipart/form-data')
      .field({
        email: 'new@test.com',
        bio: 'I am testing new bio'
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error).to.equal('No image found');
        done();
      });
  });
});
