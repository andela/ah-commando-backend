import express from 'express';
import 'express-async-errors';
import reportController from '../controllers/reportController';
import middlewares from '../middlewares';

const router = express.Router();
const { verifyToken, validateReportArticle, isActive } = middlewares;

const { reportArticle, getAllArticleReports, getOneReport } = reportController;
router.post('/:slug', verifyToken, isActive, reportArticle);
router.get('/', verifyToken, isActive, getAllArticleReports);
router.get('/:reportId', verifyToken, isActive, validateReportArticle, getOneReport);

export default router;
