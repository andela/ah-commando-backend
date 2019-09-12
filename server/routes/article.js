import express from 'express';
import 'express-async-errors';
import ArticleController from '../controllers/articleController';
import middlewares from '../middlewares';

const router = express.Router();

const {
  validateArticle,
  multerUploads,
  verifyToken,
  validateFilter,
  validateKeyword,
  validateHighlightData,
  isActive,
  optionalLogin,
} = middlewares;

const {
  createArticle,
  getAllArticles,
  getOneArticle,
  editArticle,
  deleteArticle,
  highlightText,
  createTag,
  createCategory,
  getAllTags,
  getAllCategories,
  shareOnFacebook,
  shareOnTweeter,
  getArticleCategories,
  getFeaturedArticles,
  getAllArticlesByTag
} = ArticleController;


// gets all article with option of passing a keyoword as query
router.get('/', validateKeyword, getAllArticles);
router.post('/', verifyToken, isActive, validateArticle, createArticle);
router.get('/:slug', optionalLogin, getOneArticle);
router.put('/:slug/edit', verifyToken, isActive, multerUploads, editArticle);
router.delete('/:slug', verifyToken, isActive, deleteArticle);

// filters article search result based on selected filters
router.post('/search/filter', validateFilter, getAllArticles);
router.post('/:slug/highlight', verifyToken, isActive, validateHighlightData, highlightText);

// get and create a tag
router.get('/tags/get', getAllTags);
router.post('/tags/create', verifyToken, isActive, createTag);

// get and create a category
router.get('/categories/get', getAllCategories);
router.get('/categories/article', getArticleCategories);
router.get('/categories/article/featured', getFeaturedArticles);

// share an article
router.get('/:slug/facebook-share', shareOnFacebook);
router.get('/:slug/twitter-share', shareOnTweeter);

router.post('/categories/create', verifyToken, isActive, createCategory);

router.post('/tag/get-article', getAllArticlesByTag);
export default router;
