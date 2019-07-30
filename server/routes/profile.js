import express from 'express';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';
import { multerUploads } from '../middlewares/multer';

const { isLoggedIn } = middlewares;

const profileRoute = express();

profileRoute.get('/user', isLoggedIn, UserController.userProfile);
profileRoute.get('/profiles/:username', UserController.getAuserProfile);
profileRoute.put('/user', isLoggedIn, multerUploads, UserController.editProfile);

export default profileRoute;
