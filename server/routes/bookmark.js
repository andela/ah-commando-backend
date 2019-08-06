import express from 'express';
import BookmarkController from '../controllers/bookmarkController';
import middlewares from '../middlewares';

const { verifyToken } = middlewares;

const router = express.Router();

router.post('/bookmark/:slug', verifyToken, BookmarkController.bookmarkArticle);

export default router;
