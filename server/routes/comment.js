import express from 'express';
import middlewares from '../middlewares';
import CommentController from '../controllers/commentController';

const {
  verifyToken,
  validateCommentMessage,
  validateHighlightData,
  validateGetHighlight
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

commentRouter.post('/:postId', verifyToken, validateCommentMessage, addAComment);
commentRouter.get('/:postId', verifyToken, getCommentsOnASingleArticle);
commentRouter.put('/:commentId', verifyToken, validateCommentMessage, editOwnComment);
commentRouter.delete('/:commentId', verifyToken, deleteOwnComment);
commentRouter.get('/', verifyToken, getAllCommentsForAllPosts);
commentRouter.post('/:id/highlight', verifyToken, validateHighlightData, commentAhighligh);
commentRouter.get('/:id/highlight', verifyToken, validateGetHighlight, getHighlightComment);

export default commentRouter;
