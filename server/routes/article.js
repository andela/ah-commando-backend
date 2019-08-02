import express from 'express';
import ArticleController from '../controllers/articleController';
import middlewares from '../middlewares';

const router = express.Router();

const {
  validateArticle, multerUploads, verifyToken, validateRating
} = middlewares;

const {
  createArticle,
  getAllArticles,
  getOneArticle,
  editArticle,
  deleteArticle,
  rateArticle
} = ArticleController;
router.post('/', verifyToken, validateArticle, createArticle);
router.get('/', getAllArticles);
router.get('/:slug', getOneArticle);
router.put('/:slug/edit', verifyToken, multerUploads, editArticle);
router.post('/rate/:articleId', verifyToken, validateRating, rateArticle);
router.delete('/:slug', verifyToken, deleteArticle);

export default router;
