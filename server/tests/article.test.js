/* eslint-disable no-useless-escape */
import chai from 'chai';
import chaiHttp from 'chai-http';
// import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import path from 'path';
// import { uploader } from 'cloudinary';
import dotenv from 'dotenv';
import app from '../index';
import articleData from './testData/article.data';


dotenv.config();
const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';
const wrongToken = 'wrongtoken';


// let upload;
let userToken;
// beforeEach(() => {
//   upload = sinon.stub(uploader, 'upload').returns(() => 'andela.png');
// });

// afterEach(() => {
//   upload.restore();
// });
describe('Article test', () => {
  // let userToken;
  before((done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users`)
      .send({
        user: {
          firstname: 'test',
          lastname: 'testlastname',
          username: 'testusername1',
          email: 'test1@testdomain.com',
          password: 'P@ssword123'
        }
      })
      .end((err, res) => {
        const {
          user: { token }
        } = res.body;
        userToken = token;
        done();
      });
  });

  it('it should return error if no token is provided', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .send(articleData[0])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(401);
        done();
      });
  });

  it('it should return error if wrong token is supplied', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .send(articleData[0].article)
      .set('Authorization', `Bearer ${wrongToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(401);
        done();
      });
  });

  it('should not create an article if the supplied ID is wrong', (done) => {
    const user = jwt.verify(userToken, process.env.SECRET_KEY, { expiresIn: '1h' });
    user.id = 9;
    const newToken = jwt.sign(user, process.env.SECRET_KEY);
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${newToken}`)
      .send(articleData[0])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('should create an article', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[0])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(201);
        done();
      });
  });


  it('should get all articles', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });

  it('should get a single article', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/articles/${articleData[0].article.slug}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });

  it('get single article: should throw an error if article does not exist', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/articles/44`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('should edit a single article', (done) => {
    chai
      .request(app)
      .put(`${baseUrl}/articles/${articleData[0].article.slug}/edit`)
      .send({ article: { title: 'new title' } })
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });

  it('edit single article: should throw an error if article does not exist', (done) => {
    chai
      .request(app)
      .put(`${baseUrl}/articles/wrongslug/edit`)
      .send({ article: { title: 'new title' } })
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('should delete an article', (done) => {
    chai
      .request(app)
      .delete(`${baseUrl}/articles/${articleData[0].article.slug}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });

  it('delete article: should throw an error if article does not exist', (done) => {
    chai
      .request(app)
      .delete(`${baseUrl}/articles/44`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('no title: should throw an error if title is not provided', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[1])
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error[0]).to.equal('title is required');
        done();
      });
  });

  it('no description: should throw an error if description is not provided', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[2])
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error[0]).to.equal('description is required');
        done();
      });
  });

  it('no articleBody: should throw an error if articleBody is not provided', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[3])
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error[0]).to.equal('articleBody is required');
        done();
      });
  });

  it('not boolean favorited: should throw an error if favorited is not a boolean', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[4])
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error[0]).to.equal('favorited must be a boolean');
        done();
      });
  });

  it('no tagList: should throw an error if tagList is not provided', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[5])
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error[0]).to.equal('tagList is required');
        done();
      });
  });

  it('favoriteCounts is  not an integer: should throw an error if favoriteCounts is not an integer', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[6])
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error[0]).to.equal('favoriteCounts must be a number');
        done();
      });
  });

  it('no image: should throw an error if image is not provided', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[7])
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error[0]).to.equal('image is required');
        done();
      });
  });

  it('wrong title format: should throw an error if title has incorrect format', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[8])
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error[0]).to.equal('title must not contain special character');
        done();
      });
  });

  it('wrong description format: should throw an error if description has incorrect format', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[9])
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error[0]).to.equal('description must not contain special character');
        done();
      });
  });

  it('wrong articleBody format: should throw an error if articleBody has incorrect format', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[10])
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error[0]).to.equal('article body follows the wrong format');
        done();
      });
  });

  it('wrong taglist format: should throw an error if description has incorrect format', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[11])
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error[0]).to.equal('taglist does not follow the specified format');
        done();
      });
  });

  it('empty title', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[12])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(400);
        done();
      });
  });

  it('special character in title', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[13])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(400);
        done();
      });
  });

  it('should', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/image`)
      .set('Authorization', `Bearer ${userToken}`)
      .set('Content-Type', 'multipart/form-data')
      .attach('image', path.join(__dirname, './testData/img/andela.png'))
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });
});
