import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import userRoute from './user';
import profileRoute from './profile';
import articleRoute from './article';
import imageRoute from './image';
import bookmarkRoute from './bookmark';
import { cloudinaryConfig } from '../db/config/cloudinaryConfig';


const router = express();

const swaggerDocument = yaml.load(`${__dirname}/../docs/ah-commando-doc.yml`);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('*', cloudinaryConfig);

router.get('/', (req, res) => res.status(200).json({
  status: res.statusCode,
  message: 'Hello there! This is Author\'s haven'
}));

router.use('*', cloudinaryConfig);
router.use('/users', userRoute);
router.use('/articles', articleRoute);
router.use('/image', imageRoute);
router.use('/', profileRoute);
router.use('/user', bookmarkRoute);

export default router;
