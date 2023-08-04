const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  editUserInfo,
  editAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', editUserInfo);
router.patch('/me/avatar', editAvatar);

module.exports = router;
