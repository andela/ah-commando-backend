import express from 'express';
import passport from 'passport';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';
import '../helpers/passport';

const userRoute = express();
const { validateToken, validateLogin, validateUser } = middlewares;
const {
  signUp,
  login,
  logout,
  socialSignin
} = UserController;

userRoute.post('/', validateUser, signUp);
userRoute.post('/login', validateLogin, login);

userRoute.get('/google', passport.authenticate('google', {
  scope:
  ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email']
}));
userRoute.get('/google/callback', passport.authenticate('google', { session: false }), socialSignin);

userRoute.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
userRoute.get('/facebook/callback', passport.authenticate('facebook', { session: false }), socialSignin);

userRoute.post('/logout', validateToken, logout);

export default userRoute;
