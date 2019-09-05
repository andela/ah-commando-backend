import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sendGrid from '@sendgrid/mail';
import app from '../index';
import userData from './testData/user.data';
import model from '../db/models';

const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1';
let send;
let userToken;
const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlcm5hbWUiLCJlbWFpbCI6InRlc3RAdGVzdGRvbWFpbi50ZXN0Y29tIiwiaWF0IjoxNTY0NDgwNjM5LCJleHAiOjE1NjQ0ODA2NDB9.TsuwwCFHdaGvCCxZrfAQgP8RbfErBr6MQhHRqMT9JuE';

beforeEach(() => {
  send = sinon.stub(sendGrid, 'send').returns(() => { });
});

afterEach(() => {
  send.restore();
});

describe('User tests', () => {
  describe('test for user signup', () => {
    it('Should register a user when all required input is supplied', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[0])
        .end((err, res) => {
          const { status, user } = res.body;
          expect(status).to.equal(201);
          expect(user).to.have.property('firstname');
          expect(user).to.have.property('lastname');
          expect(user).to.have.property('email');
          expect(user).to.have.property('username');
          expect(user).to.have.property('id');
          expect(user).to.have.property('token');
          userToken = user.token;
          done();
        });
    });

    it('Should not register a new user if the user already exists', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[0])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(409);
          expect(error).to.equal('User Already Exists');
          done();
        });
    });

    it('Should not register a new user if the email format is invalid', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[1])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('email must be a valid email');
          done();
        });
    });

    it('Should not register a new user if firstname is not provided', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[2])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('firstname is not allowed to be empty');
          done();
        });
    });

    it('Should not register a new user if lastname is not provided', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[3])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('lastname is not allowed to be empty');
          done();
        });
    });

    it('Should not register a new user if username is not provided', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[4])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('username is not allowed to be empty');
          done();
        });
    });

    it('Should not register a new user if firstname format is invalid', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[5])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('firstname can only contain letters');
          done();
        });
    });

    it('Should not register a new user if lastname format is invalid', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[6])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('lastname can only contain letters');
          done();
        });
    });

    it('Should not register a new user if username is less than 3 characters long', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[7])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('username length must be at least 3 characters long');
          done();
        });
    });

    it('Should not register a new user if username is more than 16 characters long', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[8])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('username length must be less than or equal to 16 characters long');
          done();
        });
    });

    it('Should not register a new user if username contains invalid characters', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[9])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('usernames can only alphanumeric characters, underscores and hyphens');
          done();
        });
    });

    it('Should not register a new user if password is less than 8 characters long', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[16])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('password length must be at least 8 characters long');
          done();
        });
    });

    it('Should not register a new user if password is weak', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
        .send(userData[17])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character');
          done();
        });
    });
  });
  describe('test for user login', () => {
    it('Should login a user with the correct credentials', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[10])
        .end((err, res) => {
          const { status, user } = res.body;
          expect(status).to.equal(200);
          expect(user).to.have.property('firstname');
          expect(user).to.have.property('lastname');
          expect(user).to.have.property('email');
          expect(user).to.have.property('username');
          expect(user).to.have.property('id');
          expect(user).to.have.property('token');
          expect(user).to.have.property('bio');
          expect(user).to.have.property('image');
          done();
        });
    });

    it('Should not login a user with incorrect email', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[11])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Incorrect Login information');
          done();
        });
    });

    it('Should not login a user with incorrect password', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[12])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Incorrect Login information');
          done();
        });
    });

    it('Should not login a user with invalid email', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[13])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('email must be a valid email');
          done();
        });
    });

    it('Should not login a user with password with less than 8 characters', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[15])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('password length must be at least 8 characters long');
          done();
        });
    });

    it('Should not login a user with password with weak password', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[14])
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character');
          done();
        });
    });
  });
  describe('User logout', () => {
    it('should successfully log out a signed in user', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[10])
        .end((err, res) => {
          const { token } = res.body.user;
          chai.request(app)
            .post(`${baseUrl}/users/logout`)
            .set('Authorization', token)
            // eslint-disable-next-line no-unused-vars
            .end((err1, res1) => {
              done();
            });
        });
    });
    it('should return 401 for an invalid token', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/logout`)
        .set('Authorization', 'token')
        .end((err1, res1) => {
          expect(res1).to.have.a.status(401);
          expect(res1.body.error).to.equal('invalid token');
          done();
        });
    });
    it('should return 401 if no token is provided', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/logout`)
        .set('Authorization', '')
        .end((err1, res1) => {
          expect(res1).to.have.a.status(401);
          expect(res1.body.error).to.equal('Authorization error');
          done();
        });
    });
    it('should show invalid token if the token is in the blacklist', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/login`)
        .send(userData[10])
        .end((err, res) => {
          const { token } = res.body.user;
          chai.request(app)
            .post(`${baseUrl}/users/logout`)
            .set('Authorization', token)
            // eslint-disable-next-line no-unused-vars
            .end((err1, res1) => {
              chai.request(app)
                .post(`${baseUrl}/users/logout`)
                .set('Authorization', token)
                .end((err2, res2) => {
                  expect(res2).to.have.a.status(401);
                  expect(res2.body.error).to.equal('invalid token');
                  done();
                });
            });
        });
    });
  });
  describe('Handle user reset password', () => {
    let userResetToken, id;
    beforeEach(async () => {
      const { email } = userData[0].user;
      const user = await model.PasswordResetTokens.findOne({ where: { email } });
      if (!user) return;
      userResetToken = user.token;
      id = user.userId;
    });
    it('Should send a reset mail to a user, if the user\'s email exists', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/passwordReset`)
        .send({ user: { email: userData[0].user.email } })
        .end((err, res) => {
          const { message, status } = res.body;
          expect(status).to.equal(200);
          expect(message).to.equal(`Hi ${userData[0].user.firstname.toUpperCase()}, A password reset link has been sent to your mail-box`);
          done();
        });
    });
    it('Should fail if user email doesn\'t exist', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/passwordReset`)
        .send({ user: { email: 'idontexist@gmail.com' } })
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('No user found with email address: idontexist@gmail.com');
          done();
        });
    });
    it('Should fail if user email is invalid', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users/passwordReset`)
        .send({ user: { email: 'idontexistgmail.com' } })
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('email must be a valid email');
          done();
        });
    });
    it('Should fail if token payload id doesn\'t match user id', (done) => {
      chai.request(app)
        .put(`${baseUrl}/users/resetPassword/${1}/mdsijidsfdsixjmd`)
        .send({ user: { password: 'P@ssword123...x' } })
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(401);
          expect(error).to.equal('Invalid Reset Token');
          done();
        });
    });
    it('Should fail if password doesn\'t meet required spec', (done) => {
      chai.request(app)
        .put(`${baseUrl}/users/resetPassword/${id}/${userResetToken}"`)
        .send({ user: { password: 'okay..' } })
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('password length must be at least 8 characters long');
          done();
        });
    });
    it('Should fail if password doesn\'t meet required spec', (done) => {
      chai.request(app)
        .put(`${baseUrl}/users/resetPassword/${id}/${userResetToken}"`)
        .send({ user: { password: 'okayPassword..' } })
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character');
          done();
        });
    });
    it('Should fail if user doesn\'t exist', (done) => {
      chai.request(app)
        .put(`${baseUrl}/users/resetPassword/${90}/${userResetToken}"`)
        .send({ user: { password: 'P@ssWord123...' } })
        .end((err, res) => {
          const { error, status } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('No user found');
          done();
        });
    });
    it('Should pass if token matches user id', (done) => {
      chai.request(app)
        .put(`${baseUrl}/users/resetPassword/${id}/${userResetToken}`)
        .send({ user: { password: 'P@ssword123...x' } })
        .end((err, res) => {
          const { message, status } = res.body;
          expect(status).to.equal(200);
          expect(message).to.equal('Success, Password Reset Successfully');
          done();
        });
    });
  });
});

describe('Social signin test', () => {
  it('should return 404 if endpoint is not found', (done) => {
    chai.request(app)
      .get(`${baseUrl}/users/google/callback/fake endpoint`)
      .end((err, res) => {
        const { error, status } = res.body;
        expect(status).to.equal(404);
        expect(error).to.equal('Endpoint Not Found');
        done();
      });
  });
  it('should return 404 if endpoint is not found', (done) => {
    chai.request(app)
      .get(`${baseUrl}/users/facebook/callback/fake endpoint`)
      .end((err, res) => {
        const { error, status } = res.body;
        expect(status).to.equal(404);
        expect(error).to.equal('Endpoint Not Found');
        done();
      });
  });
});

describe('Confirms user email', () => {
  it('Should confirm user email', (done) => {
    chai.request(app)
      .get(`${baseUrl}/users/confirmEmail?token=${userToken}&id=1`)
      .end((err, res) => {
        const { status, message } = res.body;
        expect(status).to.equal(200);
        expect(message).to.equal('Email verified successfully');
        done();
      });
  });

  it('Should send another email if requested', (done) => {
    chai.request(app)
      .get(`${baseUrl}/users/confirmEmail?token=${expiredToken}&id=1&resend=true`)
      .end((err, res) => {
        const { status, message } = res.body;
        expect(status).to.equal(200);
        expect(message).to.equal('Verification link has been sent to your email');
        done();
      });
  });

  it('Should return an error for invaild user id', (done) => {
    chai.request(app)
      .get(`${baseUrl}/users/confirmEmail?token=invalid&id=10000&resend=true`)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error).to.equal('Unable to send verification email');
        done();
      });
  });

  it('Should return an error for invalid tokens', (done) => {
    chai.request(app)
      .get(`${baseUrl}/users/confirmEmail?token=invalid&id=1`)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(400);
        expect(error).to.equal('Unable to verifiy email');
        done();
      });
  });
});
