import express from 'express';
import ImageUpload from '../helpers/imageUpload';
import middlewares from '../middlewares';

const router = express.Router();
const { multerUploads, isLoggedIn } = middlewares;
const { uploadImage } = ImageUpload;

router.post('/', isLoggedIn, multerUploads, uploadImage);

export default router;
