import express from 'express';
import UserController from '../controllers/userController';


const userRoute = express();

userRoute.post('/', UserController.signUp);
userRoute.post('/login', UserController.login);

export default userRoute;
