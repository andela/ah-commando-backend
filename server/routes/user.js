import express from 'express';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';


const userRoute = express();
const { validateToken, validateLogin, validateUser } = middlewares;
const {
  signUp, login, logout, confirmEmail
} = UserController;

userRoute.post('/', validateUser, signUp);
userRoute.post('/login', validateLogin, login);
userRoute.get('/confirmEmail', confirmEmail);
userRoute.post('/logout', validateToken, logout);

export default userRoute;
