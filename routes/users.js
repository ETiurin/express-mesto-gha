const router = require('express').Router();
const {
  createUser, getUsers, getUserById, editUserInfo, editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.patch('/me', editUserInfo);
router.patch('/me/avatar', editAvatar);

module.exports = router;
