const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { Status } = require('./error');

const { ValidationError, CastError } = mongoose.Error;
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(require('./routes'));

app.use(errors());

app.use((err, req, res, next) => {
  let statusCode = err.status || err.statusCode || Status.INTERNAL_SERVER_ERROR;
  if (err instanceof ValidationError || err instanceof CastError) {
    statusCode = Status.BAD_REQUEST;
  }
  res.status(statusCode).send({
    name: err.name,
    message: err.message,
  });
});

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`Port ${PORT} is ready to receive requests`);
});
