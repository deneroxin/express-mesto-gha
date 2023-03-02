const router = require('express').Router();
const {
  getAllUsers, getUserById, createUser, updateUserInfo, updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me/avatar', updateAvatar);
router.patch('/me', updateUserInfo);

module.exports = router;
