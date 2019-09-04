import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';
let userToken;
let subscriptionId;
let planId;
let stripeToken;

describe('Subsciption test', async () => {
  before((done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users/login`)
      .send({
        user: {
          email: 'john.doe@test.com',
          password: 'P@ssword123'
        }
      })
      .end((err, res) => {
        const { token } = res.body.user;
        userToken = token;
        chai.request(app)
          .post(`${baseUrl}/payment/token`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            card: {
              cardNumber: 4242424242424242,
              exp_month: 12,
              exp_year: 2020,
              cvc: '123'
            }
          })
          .end((err, res1) => {
            stripeToken = res1.body.result.token;
            done();
          });
      });
  });
  describe('User subscription', () => {
    it('Should subscribe a user to the plan chosen', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/payment/subscription`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          user: {
            userId: 1,
            firstname: 'test',
            lastname: 'testlastname',
            email: 'test1@testdomain.com',
            planId: 'gold',
            token: stripeToken
          }
        })
        .end((err, res) => {
          subscriptionId = res.body.result.subscription.id;
          expect(res).to.have.a.status(201);
          expect(res.body.result.message).to.be.equal('Subscription Successful');
          done();
        });
    });
    it('Should cancel a user subscription', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/payment/subscription/${subscriptionId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          user: {
            userId: 1,
          }
        })
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          expect(res.body.result.message).to.be.equal('Subscription canceled');
          done();
        });
    });
    it('Should get all subscription', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/payment/subscription`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          done();
        });
    });
  });

  describe('Subcription plan', () => {
    it('Should subscribe a user to the plan chosen', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/payment/plan`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          plan: {
            name: 'silver',
            interval: 'week',
            amount: 7,
            currency: 'usd'
          }
        })
        .end((err, res) => {
          planId = res.body.result.plan.id;
          expect(res).to.have.a.status(201);
          expect(res.body.result.message).to.be.equal('silver plan Successful created');
          done();
        });
    });
    it('Should delete a plan', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/payment/plan/${planId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          expect(res.body.result.message).to.be.equal('plan deleted');
          done();
        });
    });
    it('Should get all plans', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/payment/plan`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          done();
        });
    });
  });

  describe('Customer', () => {
    it('Should delete a customer', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/payment/customer`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          user: {
            userId: 1,
          }
        })
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          expect(res.body.result.message).to.be.equal('customer deleted');
          done();
        });
    });
  });
});
