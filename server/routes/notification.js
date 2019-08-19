import express from 'express';
import 'express-async-errors';
import NotificationController from '../controllers/notificationController';
import middlewares from '../middlewares';

const { verifyToken, validateId } = middlewares;
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  emailSubscribe,
} = NotificationController;

const profileRoute = express();

profileRoute.get('/', verifyToken, getNotifications);
profileRoute.patch('/:id/read', validateId, verifyToken, markAsRead);
profileRoute.patch('/read', verifyToken, markAllAsRead);
profileRoute.route('/email/subscribe')
  .patch(verifyToken, emailSubscribe)
  .delete(verifyToken, emailSubscribe);

export default profileRoute;
