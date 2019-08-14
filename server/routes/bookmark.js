import express from 'express';
import BookmarkController from '../controllers/bookmarkController';
import middlewares from '../middlewares';
import validateParam from '../middlewares/inputValidator';
import 'express-async-errors';

const { verifyToken, isActive } = middlewares;

const router = express.Router();

router.post('/bookmark/:articleId', verifyToken, isActive, validateParam.validateBookmark, BookmarkController.bookmarkArticle);

router.delete('/bookmark/:articleId', verifyToken, isActive, validateParam.validateBookmark, BookmarkController.unbookmarkArticle);

router.get('/bookmark', verifyToken, isActive, BookmarkController.getBookmarkedArticles);

router.delete('/bookmark', verifyToken, isActive, BookmarkController.unbookmarkAllArticles);

export default router;
