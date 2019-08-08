import express from 'express';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';

const { verifyToken, validateProfileUpdate, optionalLogin } = middlewares;
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
  .put(verifyToken, validateProfileUpdate, editProfile);

profileRoute
  .route('/profiles/:username/follow')
  .post(verifyToken, follow)
  .delete(verifyToken, follow);

export default profileRoute;
