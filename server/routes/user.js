import express from 'express';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';


const userRoute = express();

const { validateToken, validateLogin, validateUser } = middlewares;


const {
  signUp, login, logout, resetPassword, confirmEmail, sendResetLink
} = UserController;

userRoute.post('/', validateUser, signUp);
userRoute.post('/login', validateLogin, login);
userRoute.get('/confirmEmail', confirmEmail);

// logs out a user
userRoute.post('/logout', validateToken, logout);
userRoute.post('/passwordReset/', sendResetLink);
userRoute.put('/resetPassword/:id/:token', resetPassword);

export default userRoute;
