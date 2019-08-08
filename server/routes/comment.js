import express from 'express';
import middlewares from '../middlewares';
import CommentController from '../controllers/commentController';

const {
  verifyToken,
  validateCommentMessage
} = middlewares;

const {
  addAComment,
  getCommentsOnASingleArticle,
  editOwnComment,
  deleteOwnComment,
  getAllCommentsForAllPosts
} = CommentController;

const commentRouter = express();

commentRouter.post('/:postId', verifyToken, validateCommentMessage, addAComment);
commentRouter.get('/:postId', verifyToken, getCommentsOnASingleArticle);
commentRouter.put('/:commentId', verifyToken, validateCommentMessage, editOwnComment);
commentRouter.delete('/:commentId', verifyToken, deleteOwnComment);
commentRouter.get('/', verifyToken, getAllCommentsForAllPosts);

export default commentRouter;
