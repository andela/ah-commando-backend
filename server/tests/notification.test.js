import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';

describe('Notification', () => {
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

  describe('Get all user\'s notification', () => {
    it('Should successfully get all notifications for a user', (done) => {
      chai.request(app)
        .get(`${baseUrl}/notifications/`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { notifications, status } = res.body;
          expect(status).to.equal(200);
          expect(notifications).to.be.a('array');
          done();
        });
    });

    it('Should not get notifications without authentication', (done) => {
      chai.request(app)
        .get(`${baseUrl}/notifications/`)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Authorization error');
          done();
        });
    });
  });

  describe('Mark a notification as read', () => {
    it('Should successfully mark a notification as read', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/notifications/1/read`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { message, status } = res.body;
          expect(status).to.equal(200);
          expect(message).to.equal('marked as read');
          done();
        });
    });

    it('Should not mark a notification as read without authentication', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/notifications/1/read`)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Authorization error');
          done();
        });
    });
  });

  describe('Mark all notifications as read', () => {
    it('Should successfully mark all notification as read', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/notifications/read`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { message, status } = res.body;
          expect(status).to.equal(200);
          expect(message).to.equal('all notifications marked as read');
          done();
        });
    });

    it('Should not mark all notifications as read without authentication', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/notifications/read`)
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Authorization error');
          done();
        });
    });
  });

  describe('Email Notification Subscription', () => {
    it('Should successfully subscribe for email notification', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/notifications/email/subscribe`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { message, status } = res.body;
          expect(status).to.equal(200);
          expect(message).to.equal('email notification enabled');
          done();
        });
    });

    it('Should successfully unsubscribe for email notification', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/notifications/email/subscribe`)
        .set('Authorization', authToken)
        .end((err, res) => {
          const { message, status } = res.body;
          expect(status).to.equal(200);
          expect(message).to.equal('email notification disabled');
          done();
        });
    });
  });
});
