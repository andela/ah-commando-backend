import express from 'express';
import UserController from '../controllers/userController';


const userRoute = express();

userRoute.post('/signup', UserController.signUp);

export default userRoute;
