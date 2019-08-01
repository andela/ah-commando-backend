import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';

describe('Ah-commando-backend', () => {
  it('Should display welcome message on home route', (done) => {
    chai.request(app)
      .get(`${baseUrl}/`)
      .end((err, res) => {
        const { body: { message, status } } = res;
        expect(message).to.equal("Hello there! This is Author's haven");
        expect(status).to.equal(200);
        done();
      });
  });

  it('Should display an error message for an invalid route', (done) => {
    chai.request(app)
      .get(`${baseUrl}/invalid-route`)
      .end((err, res) => {
        const { body: { error, status } } = res;
        expect(error).to.equal('Endpoint Not Found');
        expect(status).to.equal(404);
        done();
      });
  });

  it('Should display an error message for server error', (done) => {
    chai.request(app)
      .get(`${baseUrl}/%`)
      .end((err, res) => {
        const { body: { error, status } } = res;
        expect(error).to.equal('Failed to decode param \'/%\'');
        expect(status).to.equal(400);
        done();
      });
  });
});
