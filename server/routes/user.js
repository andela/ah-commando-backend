import express from 'express';
import passport from 'passport';
import 'express-async-errors';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';
import '../helpers/passport';

const userRoute = express();
const {
  verifyToken, validateLogin, validateUser, validatePasswordReset,
  validateEmail
} = middlewares;
const {
  socialSignin,
  signUp, login, logout, resetPassword, confirmEmail, sendResetLink
} = UserController;

userRoute.post('/', validateUser, signUp);
userRoute.post('/login', validateLogin, login);

userRoute.get('/google', passport.authenticate('google', {
  scope:
  ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
}));
userRoute.get('/google/callback', passport.authenticate('google', { session: false }), socialSignin);

userRoute.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
userRoute.get('/facebook/callback', passport.authenticate('facebook', { session: false }), socialSignin);

userRoute.get('/confirmEmail', confirmEmail);

userRoute.post('/logout', verifyToken, logout);
userRoute.post('/passwordReset/', validateEmail, sendResetLink);
userRoute.put('/resetPassword/:id/:token', validatePasswordReset, resetPassword);

export default userRoute;
