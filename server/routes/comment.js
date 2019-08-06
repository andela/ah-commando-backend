import express from 'express';
import middlewares from '../middlewares';
import CommentController from '../controllers/commentController';

const {
  verifyToken,
  validateCommentMessage
} = middlewares;

const { addAComment } = CommentController;

const commentRouter = express();

commentRouter.post('/:postId', verifyToken, validateCommentMessage, addAComment);

export default commentRouter;
