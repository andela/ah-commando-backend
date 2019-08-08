import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import articleData from './testData/article.data';

chai.use(chaiHttp);

const baseUrl = '/api/v1';

let articleId;
let userToken;
describe('Bookmarek test', () => {
  before((done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users`)
      .send({
        user: {
          firstname: 'test',
          lastname: 'lastname',
          username: 'username1',
          email: 'testbook@mail.com',
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

  before((done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        article: {
          title: 'My new Pet',
          description: 'article description two',
          articleBody: 'this the body of the article',
          tagList: 'cars technology',
          image: 'image.jpg'
        }
      })
      .end((err, res) => {
        const {
          articles: { id }
        } = res.body;
        articleId = id;
        done();
      });
  });

  it('should return 404 if article is not found', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/user/bookmark/23888833`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[0])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('should return 404 if article to be unbookmarked is not found in article table', (done) => {
    chai
      .request(app)
      .delete(`${baseUrl}/articles/wrongSlug`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[0])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('should return 404 if article to be unbookmarked is not found in the bookmark table', (done) => {
    chai
      .request(app)
      .delete(`${baseUrl}/user/bookmark/23888833`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(articleData[0])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('should bookmark an article', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/user/bookmark/${articleId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(201);
        done();
      });
  });

  it('should get all bookmarked articles', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/user/bookmark`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });

  it('should return 409 if article already bookmarked you', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/user/bookmark/${articleId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(409);
        done();
      });
  });

  it('should unbookmark an article successfully', (done) => {
    chai
      .request(app)
      .delete(`${baseUrl}/user/bookmark/${articleId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });

  it('should bookmark a new article', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/user/bookmark/${articleId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(201);
        done();
      });
  });

  it('should unbookmark all articles successfully', (done) => {
    chai
      .request(app)
      .delete(`${baseUrl}/user/bookmark`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });

  it('should return 404 if no article is found to be unbookmarked', (done) => {
    chai
      .request(app)
      .delete(`${baseUrl}/user/bookmark`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('should return 404 if no article is found to be unbookmarked', (done) => {
    chai
      .request(app)
      .delete(`${baseUrl}/user/bookmark/784939`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('should return 404 if no bookmarked article is found in the db', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/user/bookmark`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('should return 404 if no bookmarked article is found', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/user/bookmark`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });
});
