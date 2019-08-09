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
  highlightText,
  createTag, createCategory, getAllTags, getAllCategories
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

// get and create a tag
router.get('/tags/get', getAllTags);
router.post('/tags/create', verifyToken, createTag);

// get and create a category
router.get('/categories/get', getAllCategories);
router.post('/categories/create', verifyToken, createCategory);
export default router;
