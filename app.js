const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { Status } = require('./error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

app.use(express.json());

app.use(require('./routes'));

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = Status.INTERNAL_SERVER_ERROR } = err;
  const message = statusCode === Status.INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
});

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`Port ${PORT} is ready to receive requests`);
});
