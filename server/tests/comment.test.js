import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import commentData from './testData/comment.data';
import userData from './testData/user.data';


const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';

describe('Handle Comment', () => {
  let userToken, postId, anotherUserToken, commentId;
  before('sign up a user', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users/`)
      .send(userData[20])
      .end(() => {
        done();
      });
  });
  before('sign up a another user', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users/`)
      .send({
        user: {
          firstname: 'nopost',
          lastname: 'nopost',
          username: 'nopostuser',
          email: 'test@testingdomain.com',
          password: 'P@ssword123...x',
        }
      })
      .end(() => {
        done();
      });
  });
  describe('Add Comment', () => {
    before('sign in a user', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[21])
        .end((err, res) => {
          userToken = res.body.user.token;
          done();
        });
    });
    before('sign in another user', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/users/login`)
        .send({
          user: {
            email: 'test@testingdomain.com',
            password: 'P@ssword123...x',
          }
        })
        .end((err, res) => {
          anotherUserToken = res.body.user.token;
          done();
        });
    });
    describe('Add Comment', () => {
      before('add a post', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/articles`)
          .set('Authorization', `${userToken}`)
          .send({
            article: {
              title: 'Hello',
              description: 'i say hello',
              articleBody: 'hhh',
              tagList: 'jssd',
              image: 'hs.jpg'
            }
          })
          .end((err, res) => {
            postId = res.body.articles.id;
            done();
          });
      });
      it('Should fail if user isn\'t logged in', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/comment/${postId}`)
          .send(commentData[0])
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(401);
            expect(error).to.equal('Authorization error');
            done();
          });
      });
      it('Should fail if message is empty', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/comment/${postId}`)
          .set('Authorization', `${userToken}`)
          .send(commentData[1])
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(400);
            expect(error[0]).to.equal('comment is not allowed to be empty');
            done();
          });
      });
      it('Should fail if post is not found', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/comment/${2300}`)
          .set('Authorization', `${userToken}`)
          .send(commentData[0])
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(404);
            expect(error).to.equal('Post not found');
            done();
          });
      });
      it('Should pass if user is a valid one and is logged in', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/comment/${postId}`)
          .set('Authorization', `${userToken}`)
          .send(commentData[0])
          .end((err, res) => {
            const { status } = res.body;
            commentId = res.body.comment.id;
            expect(status).to.equal(201);
            expect(res.body.comment).to.be.an('object');
            done();
          });
      });
    });
    describe('Get comments of a single post', () => {
      it('Should fail if user token is invalid', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/comment/${postId}`)
          .set('Authorization', 'jindndsnsdmcokaokokakmkmakmima')
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(401);
            expect(error).to.equal('invalid token');
            done();
          });
      });
      it('Should fail if post is not found', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/comment/9000`)
          .set('Authorization', userToken)
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(404);
            expect(error).to.equal('post not found');
            done();
          });
      });
      it('Should pass if user token is valid', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/comment/${postId}`)
          .set('Authorization', userToken)
          .end((err, res) => {
            const { status, data } = res.body;
            expect(status).to.equal(200);
            expect(data).to.have.property('comments');
            expect(data).to.have.property('noOfComments');
            done();
          });
      });
    });
    describe('Update own comments of a single post', () => {
      it('Should fail if user token is invalid', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/comment/${commentId}`)
          .set('Authorization', 'jindndsnsdmcokaokokakmkmakmima')
          .send(commentData[2])
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(401);
            expect(error).to.equal('invalid token');
            done();
          });
      });
      it('Should fail if comment does not belong to user', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/comment/${commentId}`)
          .set('Authorization', anotherUserToken)
          .send(commentData[2])
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(401);
            expect(error).to.equal('Not authorized to edit this comment');
            done();
          });
      });
      it('Should pass if user token is valid', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/comment/${commentId}`)
          .set('Authorization', userToken)
          .send(commentData[2])
          .end((err, res) => {
            const { status } = res.body;
            expect(status).to.equal(200);
            done();
          });
      });
    });
    describe('Handle delete own comment', () => {
      it('Should fail if user token is invalid', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/comment/${commentId}`)
          .set('Authorization', 'jindndsnsdmcokaokokakmkmakmima')
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(401);
            expect(error).to.equal('invalid token');
            done();
          });
      });
      it('Should fail if comment does not belong to user', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/comment/${commentId}`)
          .set('Authorization', anotherUserToken)
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(401);
            expect(error).to.equal('Not authorized to delete this comment');
            done();
          });
      });
      it('Should pass if user token is valid', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/comment/${commentId}`)
          .set('Authorization', userToken)
          .end((err, res) => {
            const { status, message } = res.body;
            expect(status).to.equal(200);
            expect(message).to.equal('Comment deleted successfully');
            done();
          });
      });
    });
    describe('Handle get all comments for all posts', () => {
      it('Should fail if user token is invalid', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/comment/`)
          .set('Authorization', 'ki04jie9ewfmkmer9jfinkdj9w')
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(401);
            expect(error).to.equal('invalid token');
            done();
          });
      });
      it('Should pass if user has post', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/comment/`)
          .set('Authorization', userToken)
          .end((err, res) => {
            const { status } = res.body;
            expect(status).to.equal(200);
            done();
          });
      });
      before('add a post', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/articles`)
          .set('Authorization', `${userToken}`)
          .send({
            article: {
              title: 'Hello',
              description: 'i say hello',
              articleBody: 'hhh',
              tagList: 'jssd',
              image: 'hs.jpg'
            }
          })
          .end((err, res) => {
            postId = res.body.articles.id;
            done();
          });
      });
      it('Should fail if user isn\'t logged in', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/comment/${postId}`)
          .send(commentData[0])
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(401);
            expect(error).to.equal('Authorization error');
            done();
          });
      });
      it('Should fail if message is empty', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/comment/${postId}`)
          .set('Authorization', `${userToken}`)
          .send(commentData[1])
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(400);
            expect(error[0]).to.equal('comment is not allowed to be empty');
            done();
          });
      });
      it('Should fail if post is not found', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/comment/${2300}`)
          .set('Authorization', `${userToken}`)
          .send(commentData[0])
          .end((err, res) => {
            const { status, error } = res.body;
            expect(status).to.equal(404);
            expect(error).to.equal('Post not found');
            done();
          });
      });
      it('Should pass if user is a valid one and is logged in', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/comment/${postId}`)
          .set('Authorization', `${userToken}`)
          .send(commentData[0])
          .end((err, res) => {
            const { status } = res.body;
            expect(status).to.equal(201);
            expect(res.body.comment).to.be.an('object');
            done();
          });
      });
    });
  });
});
