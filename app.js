const express = require('express');
const mongoose = require('mongoose');
const { Status } = require('./error');

const { ValidationError, CastError } = mongoose.Error;
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = { _id: '63fde276a2d28f1c1070d6c2' };
  next();
});
app.use(require('./routes'));

app.use((req, res) => {
  res.status(Status.NOT_FOUND).send({ message: 'Ресурс не найден' });
});

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
