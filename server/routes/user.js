import express from 'express';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';


const userRoute = express();
const { verifyToken, validateLogin, validateUser } = middlewares;
const {
  signUp, login, logout, confirmEmail
} = UserController;


userRoute.get('/confirmEmail', confirmEmail);

// logs out a user
userRoute.post('/logout', verifyToken, logout);
userRoute.post('/', UserController.signUp);
userRoute.post('/login', UserController.login);
userRoute.post('/passwordReset/', UserController.sendResetLink);
userRoute.put('/resetPassword/:id/:token', UserController.resetPassword);

export default userRoute;
