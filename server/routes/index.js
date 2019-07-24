import express from 'express';

const router = express();

router.get('/', (req, res) => res.status(200).json({
  status: res.statusCode,
  message: 'Hello there! This is Author\'s haven'
}));

export default router;
