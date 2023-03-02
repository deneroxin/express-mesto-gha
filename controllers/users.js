const User = require('../models/user');
const { DatabaseError, RequestError, Status } = require('../error');

module.exports = {
  getAllUsers: (req, res, next) => {
    User.find({})
      .then((result) => {
        if (!result) throw new DatabaseError('Массив пользователей не найден');
        res.status(Status.OK).send(result);
      })
      .catch(next);
  },
  getUserById: (req, res, next) => {
    const { userId } = req.params;
    User.findById(userId)
      .then((result) => {
        if (!result) throw new DatabaseError(`Пользователь ${userId} не найден`);
        res.status(Status.OK).send(result);
      })
      .catch(next);
  },
  createUser: (req, res, next) => {
    User.create(req.body)
      .then((result) => {
        res.status(Status.CREATED).send({ data: result });
      })
      .catch(next);
  },
  // Запросы на /me и /me/avatar объединены.
  // Их разделение позволило бы, например, запретить изменение
  // "avatar" из-под /me, а "name" и "about" из-под /me/avatar.
  // Только какой в этом смысл? Если у пользователя есть права менять любые свои данные,
  // то какая серверу разница, с какого маршрута это будет производиться.
  // Поэтому неясно, зачем разделили эти действия, выделив им разные маршруты:
  // ведь у них одна и та же цель - частичное изменение данных пользователя.
  updateUserData: (req, res, next) => {
    if (Object.keys(req.body).every((key) => User.schema.obj[key] === undefined)) {
      throw new RequestError('Запрос не содержит допустимых полей данных');
    }
    User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true })
      .then((result) => {
        res.status(Status.OK).send({ data: result });
      })
      .catch(next);
  },
};
