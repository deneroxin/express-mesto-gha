const router = require('express').Router();
const {
  getAllUsers, getUserById, createUser, updateUserData,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me/avatar', updateUserData);
router.patch('/me', updateUserData);

module.exports = router;
