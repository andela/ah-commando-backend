import express from 'express';
import 'express-async-errors';
import ImageUpload from '../helpers/imageUpload';
import middlewares from '../middlewares';

const router = express.Router();
const { multerUploads, verifyToken } = middlewares;
const { uploadImage } = ImageUpload;

router.post('/', verifyToken, multerUploads, uploadImage);

export default router;
