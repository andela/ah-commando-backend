import express from 'express';
import UserController from '../controllers/userController';
import InputValidator from '../middlewares/inputValidator';

const userRoute = express();

const { signUp, login } = UserController;
const { validateUser, validateLogin } = InputValidator;

userRoute.post('/', validateUser, signUp);
userRoute.post('/login', validateLogin, login);

export default userRoute;
