import express from 'express';
import reportController from '../controllers/reportController';
import middlewares from '../middlewares';

const router = express.Router();
const { verifyToken, validateReportArticle } = middlewares;

const { reportArticle, getAllArticleReports, getOneReport } = reportController;
router.post('/:slug', verifyToken, reportArticle);
router.get('/', verifyToken, getAllArticleReports);
router.get('/:reportId', verifyToken, validateReportArticle, getOneReport);

export default router;
