import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorhandler from 'errorhandler';
import morgan from 'morgan';
import debug from 'debug';
import chalk from 'chalk';
import { config } from 'dotenv';
import routes from './routes';

config();

const isProduction = process.env.NODE_ENV === 'production';
const app = express();
const log = debug('dev');
const port = process.env.PORT || 5040;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

if (!isProduction) {
  app.use(errorhandler());
}

app.get('/', (req, res) => res.status(301).redirect('/api/v1'));

app.use('/api/v1', routes);

app.use('*', (req, res) => res.status(404).json({
  status: res.statusCode,
  error: 'Endpoint Not Found',
}));

app.use((err, req, res) => {
  if (!isProduction) log(err.stack);
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: isProduction ? {} : err,
    },
  });
});

app.listen(port, () => log(`Listening on port ${chalk.yellow(`${port}`)}`));

export default app;
