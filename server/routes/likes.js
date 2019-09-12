import express from 'express';
import 'express-async-errors';
import ArticleController from '../controllers/articleController';
import middlewares from '../middlewares';

const router = express.Router();

const {
  verifyToken, validateLikes, isActive, optionalLogin
} = middlewares;

const {
  likeOrDislikeArticle,
  getLikerOfAnArticle
} = ArticleController;

router.post('/:resourceId', verifyToken, isActive, validateLikes, likeOrDislikeArticle);
router.get('/:resourceId', optionalLogin, getLikerOfAnArticle);

export default router;
