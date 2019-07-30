import express from 'express';
import UserController from '../controllers/userController';
import Authenticate from '../middlewares/authenticator';
import { multerUploads } from '../middlewares/multer';

const profileRoute = express();

profileRoute.get('/user', Authenticate.isLoggedIn, UserController.userProfile);
profileRoute.get('/profiles/:username', UserController.getAuserProfile);
profileRoute.put('/user', Authenticate.isLoggedIn, multerUploads, UserController.editProfile);

export default profileRoute;
