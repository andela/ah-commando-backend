import express from 'express';
import ArticleController from '../controllers/articleController';
import middlewares from '../middlewares';

const router = express.Router();

const {
  verifyToken, validateLikes
} = middlewares;

const {
  likeOrDislikeArticle
} = ArticleController;

router.post('/:resourceId', verifyToken, validateLikes, likeOrDislikeArticle);

export default router;
