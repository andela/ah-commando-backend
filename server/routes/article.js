import express from 'express';
import ArticleController from '../controllers/articleController';
import middlewares from '../middlewares';

const router = express.Router();

const {
  validateArticle,
  multerUploads,
  verifyToken,
  validateFilter,
  validateKeyword,
  validateHighlightData
} = middlewares;

const {
  createArticle,
  getAllArticles,
  getOneArticle,
  editArticle,
  deleteArticle,
  highlightText
} = ArticleController;
router.post('/', verifyToken, validateArticle, createArticle);

// gets all article with option of passing a keyoword as query
router.get('/', validateKeyword, getAllArticles);
router.get('/:slug', getOneArticle);
router.put('/:slug/edit', verifyToken, multerUploads, editArticle);
router.delete('/:slug', verifyToken, deleteArticle);

// filters article search result based on selected filters
router.post('/search/filter', validateFilter, getAllArticles);
router.post('/:slug/highlight', verifyToken, validateHighlightData, highlightText);

export default router;
