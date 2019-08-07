import express from 'express';
import BookmarkController from '../controllers/bookmarkController';
import middlewares from '../middlewares';
import validateParam from '../middlewares/inputValidator';

const { verifyToken } = middlewares;

const router = express.Router();

router.post('/bookmark/:articleId', verifyToken, validateParam.validateBookmark, BookmarkController.bookmarkArticle);

router.get('/bookmark', verifyToken, BookmarkController.getBookmarkedArticles);

router.delete('/unbookmark/:articleId', verifyToken, validateParam.validateBookmark, BookmarkController.unbookmarkArticle);

router.delete('/bookmark/removeAll', verifyToken, BookmarkController.unbookmarkAllArticles);

export default router;
