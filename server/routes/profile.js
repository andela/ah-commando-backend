import express from 'express';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';

const { isLoggedIn, validateProfileUpdate } = middlewares;

const profileRoute = express();

profileRoute.get('/user', isLoggedIn, UserController.userProfile);
profileRoute.get('/profiles/:username', UserController.getAuserProfile);
profileRoute.put('/user', isLoggedIn, validateProfileUpdate, UserController.editProfile);

export default profileRoute;
