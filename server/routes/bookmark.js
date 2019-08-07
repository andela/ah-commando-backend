import express from 'express';
import BookmarkController from '../controllers/bookmarkController';

import middlewares from '../middlewares';

const { verifyToken } = middlewares;

const router = express.Router();

router.post('/bookmark/:articleId', verifyToken, BookmarkController.bookmarkArticle);

router.delete('/unbookmark/:articleId', verifyToken, BookmarkController.unbookmarkArticle);

router.get('/bookmark', verifyToken, BookmarkController.getBookmarkedArticles);

router.delete('/bookmark/removeAll', verifyToken, BookmarkController.removeAllBookmarkedArticle);

export default router;
