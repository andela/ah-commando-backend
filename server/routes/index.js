import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import userRoute from './user';

const router = express();

const swaggerDocument = yaml.load(`${__dirname}/../docs/ah-commando-doc.yml`);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.get('/', (req, res) => res.status(200).json({
  status: res.statusCode,
  message: 'Hello there! This is Author\'s haven'
}));
router.use('/auth', userRoute);

export default router;
