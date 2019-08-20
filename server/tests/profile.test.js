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
  describe('Get profile ', () => {
    it('Should get own profile of the authorized user', (done) => {
      chai.request(app)
        .get(`${baseUrl}/user`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status, profile } = res.body;
          expect(status).to.equal(200);
          expect(profile).to.have.property('id');
          expect(profile).to.have.property('username');
          expect(profile).to.have.property('firstname');
          expect(profile).to.have.property('lastname');
          expect(profile).to.have.property('email');
          expect(profile).to.have.property('bio');
          expect(profile).to.have.property('image');
          expect(profile).to.have.property('followers');
          expect(profile).to.have.property('followings');
          expect(profile).to.have.property('followerCount');
          expect(profile).to.have.property('followingCount');
          expect(profile.followers).to.be.a('array');
          expect(profile.followings).to.be.a('array');
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

    it('Should get a user\'s profile when not logged in', (done) => {
      chai.request(app)
        .get(`${baseUrl}/profiles/testprofile`)
        .end((err, res) => {
          const { status, profile } = res.body;
          expect(status).to.equal(200);
          expect(profile).to.have.property('id');
          expect(profile).to.have.property('username');
          expect(profile).to.have.property('firstname');
          expect(profile).to.have.property('lastname');
          expect(profile).to.have.property('email');
          expect(profile).to.have.property('bio');
          expect(profile).to.have.property('image');
          expect(profile).to.have.property('followers');
          expect(profile).to.have.property('followings');
          expect(profile).to.have.property('followerCount');
          expect(profile).to.have.property('followingCount');
          expect(profile.followers).to.be.a('array');
          expect(profile.followings).to.be.a('array');
          done();
        });
    });

    it('Should get a user\'s profile when not logged in', (done) => {
      chai.request(app)
        .get(`${baseUrl}/profiles/testprofile`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status, profile } = res.body;
          expect(status).to.equal(200);
          expect(profile).to.have.property('id');
          expect(profile).to.have.property('username');
          expect(profile).to.have.property('firstname');
          expect(profile).to.have.property('lastname');
          expect(profile).to.have.property('email');
          expect(profile).to.have.property('bio');
          expect(profile).to.have.property('image');
          expect(profile).to.have.property('followers');
          expect(profile).to.have.property('followings');
          expect(profile).to.have.property('followerCount');
          expect(profile).to.have.property('followingCount');
          expect(profile.followers).to.be.a('array');
          expect(profile.followings).to.be.a('array');
          expect(profile).to.have.property('following');
          done();
        });
    });

    it('Should not get a user\'s profile invalid token is provided', (done) => {
      chai.request(app)
        .get(`${baseUrl}/profiles/testprofile`)
        .set('authorization', 'Bearer invalid token')
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('invalid token');
          done();
        });
    });

    it('Should give error if user\'s profile is not found', (done) => {
      chai.request(app)
        .get(`${baseUrl}/profiles/test`)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('User not found');
          done();
        });
    });
  });

  describe('Edit profile', () => {
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
  });

  describe('Upload profile', () => {
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

  describe('Follow user', () => {
    let authToken = '';
    before((done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send({
          user: {
            email: 'john.doe@test.com',
            password: 'P@ssword123'
          }
        })
        .end((err, res) => {
          const { token } = res.body.user;
          authToken = token;
          done();
        });
    });

    it('Should follow a user successfully', (done) => {
      chai.request(app)
        .post(`${baseUrl}/profiles/test_fellow/follow`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { status, message } = res.body;
          expect(status).to.equal(200);
          expect(message).to.equal('successful');
          done();
        });
    });

    it('Should not follow a user that is followed already', (done) => {
      chai.request(app)
        .post(`${baseUrl}/profiles/test_fellow/follow`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error).to.equal('Already following test_fellow');
          done();
        });
    });

    it('Should not follow self', (done) => {
      chai.request(app)
        .post(`${baseUrl}/profiles/j_doe23/follow`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error).to.equal('You cannot follow yourself');
          done();
        });
    });

    it('Should not follow a non existing user', (done) => {
      chai.request(app)
        .post(`${baseUrl}/profiles/idontexist/follow`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('User with username: idontexist not found');
          done();
        });
    });

    it('Should not follow when not logged in', (done) => {
      chai.request(app)
        .post(`${baseUrl}/profiles/test_fellow/follow`)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Authorization error');
          done();
        });
    });

    it('Should not follow when token is invalid', (done) => {
      chai.request(app)
        .post(`${baseUrl}/profiles/test_fellow/follow`)
        .set('Authorization', 'Bearer authToken')
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('invalid token');
          done();
        });
    });
  });

  describe('Unollow user', () => {
    let authToken = '';
    before((done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send({
          user: {
            email: 'john.doe@test.com',
            password: 'P@ssword123'
          }
        })
        .end((err, res) => {
          const { token } = res.body.user;
          authToken = token;
          done();
        });
    });

    it('Should unfollow a user successfully', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/profiles/test_fellow/follow`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { status, message } = res.body;
          expect(status).to.equal(200);
          expect(message).to.equal('successful');
          done();
        });
    });

    it('Should not unfollow a user that\'s not followed', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/profiles/test_fellow/follow`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error).to.equal('You are not following test_fellow');
          done();
        });
    });

    it('Should not unfollow self', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/profiles/j_doe23/follow`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error).to.equal('You cannot unfollow yourself');
          done();
        });
    });

    it('Should not unfollow a non existing user', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/profiles/idontexist/follow`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('User with username: idontexist not found');
          done();
        });
    });

    it('Should not unfollow when not logged in', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/profiles/test_fellow/follow`)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Authorization error');
          done();
        });
    });

    it('Should not unfollow when token is invalid', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/profiles/test_fellow/follow`)
        .set('Authorization', 'Bearer authToken')
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('invalid token');
          done();
        });
    });
  });

  describe('List all users test', () => {
    let authToken = '';
    before((done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send({
          user: {
            email: 'admin@admin.com',
            password: 'P@ssword123'
          }
        })
        .end((err, res) => {
          const { token } = res.body.user;
          authToken = token;
          done();
        });
    });
    it('Get a list of all the users', (done) => {
      chai.request(app)
        .get(`${baseUrl}/profiles`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          const { status, Users } = res.body;
          expect(status).to.equal(200);
          expect(Users).to.be.a('array');
          done();
        });
    });

    it('should paginate the list of all the users', (done) => {
      chai.request(app)
        .get(`${baseUrl}/profiles/?limit=1&page=1`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          const { status, Users } = res.body;
          expect(status).to.equal(200);
          expect(Users).to.have.property('page');
          expect(Users).to.have.property('numberOfPages');
          expect(Users).to.have.property('data');
          expect(Users.data).to.be.a('array');
          done();
        });
    });
  });
});
