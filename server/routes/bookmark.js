import express from 'express';
import 'express-async-errors';
import BookmarkController from '../controllers/bookmarkController';
import middlewares from '../middlewares';
import validateParam from '../middlewares/inputValidator';

const { verifyToken, isActive } = middlewares;

const router = express.Router();

router.post('/bookmark/:articleId', verifyToken, isActive, validateParam.validateBookmark, BookmarkController.bookmarkArticle);

router.delete('/bookmark/:articleId', verifyToken, isActive, validateParam.validateBookmark, BookmarkController.unbookmarkArticle);

router.get('/bookmark', verifyToken, isActive, BookmarkController.getBookmarkedArticles);

router.delete('/bookmark', verifyToken, isActive, BookmarkController.unbookmarkAllArticles);

export default router;
