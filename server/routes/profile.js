import express from 'express';
import UserController from '../controllers/userController';
import Authenticate from '../middleware/authenticator';


const profileRoute = express();

profileRoute.get('/user', Authenticate.isLoggedIn, UserController.userProfile);

export default profileRoute;
