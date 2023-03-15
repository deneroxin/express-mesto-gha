const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { GeneralError, Status } = require('../error');

function updateUserData(specificLogic) {
  return (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true })
      .then((updatedUserData) => {
        // поскольку req.user._id берётся из payload токена, а не путём поиска в базе данных,
        // то нет уверенности, что в базе данных такой пользователь всё ещё есть.
        // За время хранения токена база данных могла быть повреждена, и пользователь удалился.
        if (!updatedUserData) throw new GeneralError('Вас нет в базе данных', Status.INTERNAL_SERVER_ERROR);
        res.status(Status.OK).send({ data: updatedUserData });
        specificLogic(updatedUserData); // Например, здесь может быть выполнена специфичная логика
      })
      .catch(next);
  };
}

module.exports = {

  login: (req, res, next) => {
    const { email, password } = req.body;
    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign(
          { _id: user._id },
          'hardcoded-secret-key',
          { expiresIn: '7d' },
        );
        res.status(Status.OK)
          .cookie('jwt', `Bearer ${token}`, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })
          .send(user);
      })
      .catch(next);
  },

  getAllUsers: (req, res, next) => {
    User.find({})
      .then((arrayOfUsers) => {
        res.status(Status.OK).send(arrayOfUsers);
      })
      .catch(next);
  },

  getUserById: (req, res, next) => {
    const { userId } = req.params;
    User.findById(userId)
      .then((user) => {
        if (!user) throw new GeneralError(`Пользователь ${userId} не найден`);
        res.status(Status.OK).send(user);
      })
      .catch(next);
  },

  getCurrentUser: (req, res, next) => {
    User.findById(req.user._id)
      .then((user) => {
        if (!user) throw new GeneralError('Вас нет в базе данных', Status.INTERNAL_SERVER_ERROR);
        res.status(Status.OK).send(user);
      })
      .catch(next);
  },

  createUser: (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create([{ ...req.body, password: hash }], { validateBeforeSave: true }))
      .then(([newlyCreatedUser]) => {
        // возможно, из-за того, что create() возвращает Promise, а не Query,
        // select: false не работает с create(), и пароль приходится отсеивать вручную:
        const { password, ...newUserData } = newlyCreatedUser.toObject();
        res.status(Status.CREATED).send({ data: newUserData });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new GeneralError(
            'Пользователь с таким email уже зарегистрирован',
            Status.CONFLICT,
          ));
        }
        next(err);
      });
  },

  updateUserInfo: updateUserData((userData) => {
    // Обработчик реализован с использованием декоратора (просто чтобы попрактиковаться),
    // хотя общую логику дополнить нечем:
    console.log(`Updated user's name: ${userData.name}`);
  }),

  updateAvatar: updateUserData((userData) => {
    // Обработчик реализован с использованием декоратора (просто чтобы попрактиковаться),
    // хотя общую логику дополнить нечем:
    console.log(`Updated avatar address: ${userData.avatar}`);
  }),
};
