import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import userData from './testData/user.data';

const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlcm5hbWUiLCJlbWFpbCI6InRlc3RAdGVzdGRvbWFpbi50ZXN0Y29tIiwiaWF0IjoxNTY0NDgwNjM5LCJleHAiOjE1NjQ0ODA2NDB9.TsuwwCFHdaGvCCxZrfAQgP8RbfErBr6MQhHRqMT9JuE';

describe('Test admin functionality', () => {
  let commonUserToken,
    inactiveUserToken,
    adminToken,
    moderatorToken,
    articleId,
    commentId,
    godToken;
  before('sign up a user', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users/`)
      .send(userData[20])
      .end(() => {
        done();
      });
  });
  before('sign up an inactive user', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users/`)
      .send(userData[22])
      .end(() => {
        done();
      });
  });
  before('sign up an admin', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users/`)
      .send(userData[24])
      .end(() => {
        done();
      });
  });
  before('sign up a moderator', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users/`)
      .send(userData[25])
      .end(() => {
        done();
      });
  });
  before('sign up a god', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users/`)
      .send(userData[26])
      .end(() => {
        done();
      });
  });
  describe('Handle set role functionality', () => {
    before('sign in a common user', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[21])
        .end((err, res) => {
          commonUserToken = res.body.user.token;
          done();
        });
    });
    before('sign in an inactive user', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[27])
        .end((err, res) => {
          inactiveUserToken = res.body.user.token;
          done();
        });
    });
    before('sign in an admin', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[28])
        .end((err, res) => {
          adminToken = res.body.user.token;
          done();
        });
    });
    before('sign in a moderator', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[30])
        .end((err, res) => {
          moderatorToken = res.body.user.token;
          done();
        });
    });
    before('sign in a god', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[34])
        .end((err, res) => {
          godToken = res.body.user.token;
          done();
        });
    });
    before('create an article', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles/`)
        .set('Authorization', adminToken)
        .send({
          article: {
            title: 'Love frequently',
            description: 'You can love frequently',
            articleBody: 'Just love',
            tagList: 'love',
            image: 'love.jpg'
          }
        })
        .end((err, res) => {
          articleId = res.body.articles.id;
          done();
        });
    });
    before('add a comment', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/comment/${articleId}`)
        .set('Authorization', commonUserToken)
        .send({ comment: 'What a great post. keep it up bro!' })
        .end((err, res) => {
          commentId = res.body.comment.id;
          done();
        });
    });
    it('Should fail if admin token is invalid', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/assignRole`)
        .set('Authorization', invalidToken)
        .send(userData[23])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('invalid token');
          done();
        });
    });
    it('Should fail if a common user tries to access this route', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/assignRole`)
        .set('Authorization', commonUserToken)
        .send(userData[23])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Authorization error');
          done();
        });
    });
    it('Should fail if an inactive user tries to access this route', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/assignRole`)
        .set('Authorization', inactiveUserToken)
        .send(userData[23])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Authorization error');
          done();
        });
    });
    it('Should fail if the role inputed doesn\'t match array of available roles', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/assignRole`)
        .set('Authorization', adminToken)
        .send(userData[29])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('newRole must be one of [god, admin, moderator, user]');
          done();
        });
    });
    it('Should fail if the user is a moderator', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/assignRole`)
        .set('Authorization', moderatorToken)
        .send(userData[23])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('You cannot perform this action. Please contact an Admin');
          done();
        });
    });
    it('Should fail if the user is not found in the database', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/assignRole`)
        .set('Authorization', adminToken)
        .send(userData[31])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal(`No user found with username: ${userData[31].username}`);
          done();
        });
    });
    it('Should fail if the user is an admin and is trying to assign a newRole of god', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/assignRole`)
        .set('Authorization', adminToken)
        .send(userData[32])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('You cannot perform this action. Please contact a god');
          done();
        });
    });
    it('Should fail if the user is an admin and is trying to assign a newRole of admin', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/assignRole`)
        .set('Authorization', adminToken)
        .send(userData[33])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('You cannot perform this action. Please contact a god');
          done();
        });
    });
    it('Should pass and return status 200 if user is admin and newRole is moderator', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/assignRole`)
        .set('Authorization', adminToken)
        .send(userData[23])
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          expect(res.body.user).to.be.an('object');
          done();
        });
    });
  });
  describe('Handle set user active status', () => {
    it('Should should fail if the supplied request username is not a valid string', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/setActiveStatus/&&&&`)
        .set('Authorization', adminToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error).to.equal('Invalid type for username: type should be a string');
          done();
        });
    });
    it('Should should fail if the supplied username does not exist', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/setActiveStatus/idontexistoo`)
        .set('Authorization', adminToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('No user found with username: idontexistoo');
          done();
        });
    });
    it('Should should pass if user exist and user is not a common user', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/admin/setActiveStatus/moderator`)
        .set('Authorization', adminToken)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          expect(res.body).to.have.property('user');
          done();
        });
    });
  });
  describe('Handle delete a user post', () => {
    it('Should fail if user does not exist in the platform', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/admin/deleteUser/idontexistoooo`)
        .set('Authorization', godToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('No user found with username: idontexistoooo');
          done();
        });
    });
    it('Should fail if user is not a god', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/admin/deleteUser/testinactiveuser`)
        .set('Authorization', adminToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('You cannot perform this action. Please contact a god');
          done();
        });
    });
    it('Should pass if user is a god, and add the user to the deleted user table', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/admin/deleteUser/testinactiveuser`)
        .set('Authorization', godToken)
        .end((err, res) => {
          const { status, message } = res.body;
          expect(status).to.equal(200);
          expect(message).to.equal('user with username testinactiveuser has been deleted from Author\'s Haven');
          done();
        });
    });
  });
  describe('Handle delete an article', () => {
    it('Should fail if id type is not a number', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/admin/deleteArticle/herhelloworld`)
        .set('Authorization', godToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error).to.equal('Invalid type for id: type should be an integer');
          done();
        });
    });
    it('Should fail if requesting user is just a common user', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/admin/deleteArticle/${articleId}`)
        .set('Authorization', commonUserToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Authorization error');
          done();
        });
    });
    it('Should fail if post id is not found', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/admin/deleteArticle/${900}`)
        .set('Authorization', godToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('Article not found');
          done();
        });
    });
    it('Should successfully delete an article', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/admin/deleteArticle/${articleId}`)
        .set('Authorization', godToken)
        .end((err, res) => {
          const { status, message } = res.body;
          expect(status).to.equal(200);
          expect(message).to.equal('Article deleted successfully');
          done();
        });
    });
  });
  describe('Handle delete comment', () => {
    it('Should fail if a common user uses this route', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/admin/deleteComment/${commentId}`)
        .set('Authorization', commonUserToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Authorization error');
          done();
        });
    });
    it('Should fail if comment id is not found', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/admin/deleteComment/${900}`)
        .set('Authorization', godToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('Comment not found');
          done();
        });
    });
    it('Should pass and delete comment if it exists and user is valid', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/admin/deleteComment/${commentId}`)
        .set('Authorization', godToken)
        .end((err, res) => {
          const { status, message } = res.body;
          expect(status).to.equal(200);
          expect(message).to.equal('Comment deleted successfully');
          done();
        });
    });
  });
  describe('Handle admin get single user', () => {
    it('Should fail if username is not found in the platform', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/admin/getUser/idonotexist`)
        .set('Authorization', godToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('User not found');
          done();
        });
    });
    it('Should pass if username is found', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/admin/getUser/lundii`)
        .set('Authorization', godToken)
        .end((err, res) => {
          const { status, data } = res.body;
          expect(status).to.equal(200);
          expect(data).to.be.an('object');
          done();
        });
    });
  });

  describe('god can create new user', () => {
    it('create a new user if all details are given', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/admin/user/`)
        .send(userData[35])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { status, user } = res.body;
          expect(status).to.equal(201);
          expect(user).to.include.all.keys('firstname', 'lastname', 'email', 'role', 'username');
          done();
        });
    });
    it('should return 409 if user already exits', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/admin/user/`)
        .send(userData[35])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(409);
          expect(error).to.equal('User Already Exists');
          done();
        });
    });
    it('Should fail if user does not have permission', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/admin/user/`)
        .set('Authorization', adminToken)
        .send(userData[35])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('You cannot perform this action. Please contact a god');
          done();
        });
    });
    it('Should not register a new user if username is less than 3 characters long', (done) => {
      chai.request(app)
        .post(`${baseUrl}/admin/user`)
        .send(userData[7])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('username length must be at least 3 characters long');
          done();
        });
    });
    it('Should not register a new user if username is more than 16 characters long', (done) => {
      chai.request(app)
        .post(`${baseUrl}/admin/user`)
        .send(userData[8])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('username length must be less than or equal to 16 characters long');
          done();
        });
    });

    it('Should not register a new user if username contains invalid characters', (done) => {
      chai.request(app)
        .post(`${baseUrl}/admin/user`)
        .send(userData[9])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('usernames can only alphanumeric characters, underscores and hyphens');
          done();
        });
    });
    it('Should not register a new user if firstname format is invalid', (done) => {
      chai.request(app)
        .post(`${baseUrl}/admin/user`)
        .send(userData[5])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('firstname can only contain letters');
          done();
        });
    });
    it('Should not register a new user if firstname is not provided', (done) => {
      chai.request(app)
        .post(`${baseUrl}/admin/user`)
        .send(userData[2])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('firstname is not allowed to be empty');
          done();
        });
    });

    it('Should not register a new user if lastname is not provided', (done) => {
      chai.request(app)
        .post(`${baseUrl}/admin/user`)
        .send(userData[3])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('lastname is not allowed to be empty');
          done();
        });
    });

    it('Should not register a new user if lastname format is invalid', (done) => {
      chai.request(app)
        .post(`${baseUrl}/admin/user`)
        .send(userData[6])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('lastname can only contain letters');
          done();
        });
    });
  });

  describe('god can get a user', () => {
    it('should get a user with the id', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/admin/user/1`)
        .set('Authorization', godToken)
        .end((err, res) => {
          const { status, user } = res.body;
          expect(status).to.equal(200);
          expect(user).to.include.all.keys('firstname', 'lastname', 'email', 'role', 'username');
          done();
        });
    });
    it('Should return 400 if the id is not a number', (done) => {
      chai.request(app)
        .get(`${baseUrl}/admin/user/iiop`)
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('id must be a number');
          done();
        });
    });
  });

  describe('god can update a user', () => {
    it('should update a user with the given id', (done) => {
      chai
        .request(app)
        .patch(`${baseUrl}/admin/user/14`)
        .set('Authorization', godToken)
        .send(userData[36])
        .end((err, res) => {
          const { status, user } = res.body;
          expect(status).to.equal(201);
          expect(user).to.include.all.keys('firstname', 'lastname', 'email', 'role', 'username');
          done();
        });
    });
    it('Should fail if user does not have permission', (done) => {
      chai
        .request(app)
        .patch(`${baseUrl}/admin/user/14`)
        .set('Authorization', adminToken)
        .send(userData[36])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('You cannot perform this action. Please contact a god');
          done();
        });
    });
    it('Should not register a new user if username is less than 3 characters long', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/admin/user/14`)
        .send(userData[7])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('username length must be at least 3 characters long');
          done();
        });
    });
    it('Should not register a new user if username is more than 16 characters long', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/admin/user/14`)
        .send(userData[8])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('username length must be less than or equal to 16 characters long');
          done();
        });
    });

    it('Should not register a new user if username contains invalid characters', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/admin/user/14`)
        .send(userData[9])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('usernames can only alphanumeric characters, underscores and hyphens');
          done();
        });
    });
    it('Should not register a new user if firstname format is invalid', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/admin/user/14`)
        .send(userData[5])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('firstname can only contain letters');
          done();
        });
    });
    it('Should not register a new user if firstname is not provided', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/admin/user/14`)
        .send(userData[2])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('firstname is not allowed to be empty');
          done();
        });
    });

    it('Should not register a new user if lastname is not provided', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/admin/user/14`)
        .send(userData[3])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('lastname is not allowed to be empty');
          done();
        });
    });

    it('Should not register a new user if lastname format is invalid', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/admin/user/14`)
        .send(userData[6])
        .set('Authorization', godToken)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('lastname can only contain letters');
          done();
        });
    });
  });
});
