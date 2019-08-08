import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import reportData from './testData/report.data';


const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';
const wrongSlug = 'wrongSlug';


let userToken;
let articleSlug;
describe('Report test', () => {
  before((done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users/login`)
      .send({
        user: {
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

  before((done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        article: {
          title: 'this chi',
          description: 'description',
          articleBody: 'article body',
          tagList: 'android dragons',
          image: 'image.png'
        }
      })
      .end((err, res) => {
        const {
          articles: { slug }
        } = res.body;
        articleSlug = slug;
        done();
      });
  });

  it('it should return error if no token is provided', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/report/${articleSlug}`)
      .send(reportData[0])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(401);
        done();
      });
  });

  it('it should return error article is not found', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/report/${wrongSlug}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(reportData[0])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('it should create a report', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/report/${articleSlug}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(reportData[0])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(201);
        done();
      });
  });

  it('it should return an error if a user wants to report an article twice', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/report/${articleSlug}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(reportData[0])
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(409);
        done();
      });
  });

  it('it should get all reports', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/report`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });

  it('it should get a single report by the reportId', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/report/1`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(200);
        done();
      });
  });

  it('it should return an error if report is not found', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/report/52`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('it throw an error if reportId is not an integer', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/report/r`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(400);
        done();
      });
  });
});
