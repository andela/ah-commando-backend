import express from 'express';
import passport from 'passport';
import userController from '../controllers/userController';
import '../helpers/passport';

const socialRouter = express.Router();

const { socialSignin } = userController;

socialRouter.get('/google', passport.authenticate('google', { scope: ['email'] }));
socialRouter.get('/google/callback', passport.authenticate('google', { session: false }), socialSignin);

socialRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
socialRouter.get('/facebook/callback', passport.authenticate('facebook', { session: false }), socialSignin);

export default socialRouter;
