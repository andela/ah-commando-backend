import express from 'express';
import 'express-async-errors';
import middlewares from '../middlewares';
import CommentController from '../controllers/commentController';

const {
  verifyToken,
  validateCommentMessage,
  validateHighlightData,
  validateGetHighlight,
  isActive
} = middlewares;

const {
  addAComment,
  getCommentsOnASingleArticle,
  editOwnComment,
  deleteOwnComment,
  getAllCommentsForAllPosts,
  commentAhighligh,
  getHighlightComment
} = CommentController;

const commentRouter = express();

commentRouter.post('/:postId', verifyToken, isActive, validateCommentMessage, addAComment);
commentRouter.get('/:postId', verifyToken, getCommentsOnASingleArticle);
commentRouter.put('/:commentId', verifyToken, isActive, validateCommentMessage, editOwnComment);
commentRouter.delete('/:commentId', verifyToken, isActive, deleteOwnComment);
commentRouter.get('/', verifyToken, getAllCommentsForAllPosts);
commentRouter.post('/:id/highlight', verifyToken, isActive, validateHighlightData, commentAhighligh);
commentRouter.get('/:id/highlight', verifyToken, isActive, validateGetHighlight, getHighlightComment);

export default commentRouter;
