/* eslint-disable max-len */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorhandler from 'errorhandler';
import morgan from 'morgan';
import debug from 'debug';
import chalk from 'chalk';
import passport from 'passport';
import { config } from 'dotenv';
import routes from './routes';

config();

const isProduction = process.env.NODE_ENV === 'production';
const app = express();
const log = debug('dev');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
/* istanbul ignore next */
if (!isProduction) app.use(errorhandler());

app.get('/', (req, res) => res.status(301).redirect('/api/v1'));

app.use('/api/v1', routes);

app.use('*', (req, res) => res.status(404).json({
  status: res.statusCode,
  error: 'Endpoint Not Found'
}));
const setHeaders = () => (req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:5000');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
};


app.use(setHeaders());
/* istanbul ignore next */
app.use((err, req, res, next) => {
  if (!isProduction) log(err.stack);
  if (res.headersSent) return next(err);
  return res.status(err.status || 500).json({
    status: res.statusCode,
    error: err.message
  });
});

app.listen(port, () => log(`Listening on port ${chalk.yellow(`${port}`)}`));

export default app;
