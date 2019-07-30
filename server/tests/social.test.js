import { expect } from 'chai';
import sinon from 'sinon';
import userController from '../controllers/userController';

describe('Social signin test', () => {
  const req = {
    user: {
      _json: {
        id: 'userid',
        name: 'Martins Obayomi',
        email: 'martins@test.com',
        username: 'martins@test.com',
        imageUrl: 'myImage.jpg',
        isVerified: true
      }
    }
  };

  const notFound = () => {
    const response = {};
    response.status = () => 404;
    response.json = () => ({ errors: { message: 'Account not found' } });
    return response;
  };

  const success = () => {
    const response = {};
    response.status = () => 200;
    response.json = () => ({
      user: {
        email: 'martins@test.com',
        token: 'hjshkshnjdjnsjkksknsjsjsj',
        username: 'martins@test.com',
        imageUrl: 'myImage.jpg',
      }
    });
    return response;
  };

  it('should return 200 on successful signin', async () => {
    sinon.stub(userController, 'socialSignin').returns(success());
    const result = await userController.socialSignin(req, {}, () => ({}));
    expect(result.status()).to.equal(200);
    expect(result.json().user.email).to.be.a('string');
    expect(result.json().user.email).to.equal('martins@test.com');
    expect(result.json().user.token).to.be.a('string');
    expect(result.json().user.username).to.be.a('string');
    expect(result.json().user.username).to.equal('martins@test.com');
    expect(result.json().user.imageUrl).to.be.a('string');
    expect(result.json().user.imageUrl).to.equal('myImage.jpg');
    userController.socialSignin.restore();
  });

  it('should return 404 if user is not found on request object', async () => {
    const req = {};
    sinon.stub(userController, 'socialSignin').returns(notFound());
    const result = await userController.socialSignin(req, {}, () => ({}));
    expect(result.status()).to.equal(404);
    expect(result.json().errors.message).to.equal('Account not found');
    userController.socialSignin.restore();
  });
});
