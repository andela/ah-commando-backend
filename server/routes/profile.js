import express from 'express';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';

const { verifyToken, validateProfileUpdate } = middlewares;

const profileRoute = express();

profileRoute.get('/user', verifyToken, UserController.userProfile);
profileRoute.get('/profiles/:username', UserController.getAuserProfile);
profileRoute.put('/user', verifyToken, validateProfileUpdate, UserController.editProfile);

export default profileRoute;
