const User = require('../models/user');
const { DatabaseError, Status } = require('../error');

function updateUserData(specificLogic) {
  return (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true })
      .then((result) => {
        res.status(Status.OK).send({ data: result });
        specificLogic(result); // Например, здесь может быть выполнена специфичная логика
      })
      .catch(next);
  };
}

module.exports = {
  getAllUsers: (req, res, next) => {
    User.find({})
      .then((result) => {
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
  // Сейчас логика в обоих запросах получается полностью идентичной, и её нечем дополнить.
  // Чтобы попрактиковаться в реализации декоратора, я добавил ненужные действия:
  updateUserInfo: updateUserData((userData) => {
    console.log(`Updated user's name: ${userData.name}`);
  }),
  updateAvatar: updateUserData((userData) => {
    console.log(`Updated avatar address: ${userData.avatar}`);
  }),
};
