const express = require('express');
const { Status } = require('./error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = { _id: '63fde276a2d28f1c1070d6c2' };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});

app.use((err, req, res, next) => {
  res.status(err.status || err.statusCode || Status.INTERNAL_SERVER_ERROR).send({
    name: err.name,
    message: err.message,
  });
});

require('mongoose').connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`Port ${PORT} is ready to receive requests`);
});
