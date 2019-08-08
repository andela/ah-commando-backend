import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import commentData from './testData/comment.data';
import userData from './testData/user.data';


const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';

describe('Handle Comment', () => {
  let userToken, postId;
  before('sign up a user', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users/`)
      .send(userData[20])
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
        .post(`${baseUrl}/comment/${230}`)
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
