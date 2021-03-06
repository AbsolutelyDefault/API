import '@babel/polyfill';
import './utils/dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, POST, DELETE, PATCH');
  next();
});
app.options('*', (req, res) => res.end());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${server.address().port}`);
});
