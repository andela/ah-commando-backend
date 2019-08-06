import express from 'express';
import ArticleController from '../controllers/articleController';
import middlewares from '../middlewares';

const router = express.Router();

const {
  validateArticle, multerUploads, verifyToken, validateFilter, validateKeyword
} = middlewares;

const {
  createArticle,
  getAllArticles,
  getOneArticle,
  editArticle,
  deleteArticle,
  likeOrDislikeArticle,
} = ArticleController;
router.post('/', verifyToken, validateArticle, createArticle);

// gets all article with option of passing a keyoword as query
router.get('/', validateKeyword, getAllArticles);
router.get('/:slug', getOneArticle);
router.put('/:slug/edit', verifyToken, multerUploads, editArticle);
router.delete('/:slug', verifyToken, deleteArticle);
router.post('/:articleId/likes', verifyToken, likeOrDislikeArticle);

// filters article search result based on selected filters
router.post('/search/filter', validateFilter, getAllArticles);

export default router;
