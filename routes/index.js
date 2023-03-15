const router = require('express').Router();
const cookieParser = require('cookie-parser');
const validator = require('validator');
const { Joi, celebrate } = require('celebrate');
const { GeneralError } = require('../error');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { patternURL } = require('../utils').validationPatterns;

// function isStrongPassword(value) {
//   if (validator.isStrongPassword(value)) return value;
//   throw new Error('Password is not strong enough');
// }

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(patternURL), // используем свой валидатор, как и в схеме, по ТЗ
  }),
}), createUser);

router.use(cookieParser());

router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

router.use((req, res, next) => {
  next(new GeneralError('Ресурс не найден'));
});

module.exports = router;
