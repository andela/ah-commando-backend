import express from 'express';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';

const userRoute = express();
const {
  verifyToken, validateLogin, validateUser, validatePasswordReset,
  validateEmail,
} = middlewares;
const {
  signUp, login, logout, resetPassword, confirmEmail, sendResetLink
} = UserController;

userRoute.post('/', validateUser, signUp);
userRoute.post('/login', validateLogin, login);
userRoute.get('/confirmEmail', confirmEmail);
// logs out a user
userRoute.post('/logout', verifyToken, logout);
userRoute.post('/passwordReset/', validateEmail, sendResetLink);
userRoute.put('/resetPassword/:id/:token', validatePasswordReset, resetPassword);

export default userRoute;
