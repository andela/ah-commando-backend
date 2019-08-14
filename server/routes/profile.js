import express from 'express';
import 'express-async-errors';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';

const {
  verifyToken, validateProfileUpdate, optionalLogin, isActive
} = middlewares;
const {
  userProfile,
  listUsers,
  getAuserProfile,
  editProfile,
  follow
} = UserController;

const profileRoute = express();

profileRoute.get('/profiles', verifyToken, listUsers);
profileRoute.get('/profiles/:username', optionalLogin, getAuserProfile);
profileRoute
  .route('/user')
  .get(verifyToken, userProfile)
  .put(verifyToken, isActive, validateProfileUpdate, editProfile);

profileRoute
  .route('/profiles/:username/follow')
  .post(verifyToken, isActive, follow)
  .delete(verifyToken, isActive, follow);

export default profileRoute;
