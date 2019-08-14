import express from 'express';
import ImageUpload from '../helpers/imageUpload';
import middlewares from '../middlewares';
import 'express-async-errors';

const router = express.Router();
const { multerUploads, verifyToken } = middlewares;
const { uploadImage } = ImageUpload;

router.post('/', verifyToken, multerUploads, uploadImage);

export default router;
