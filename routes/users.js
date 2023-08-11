const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUserById,
  editUserInfo,
  editAvatar,
} = require('../controllers/users');

const {
  userIdValidation,
  userInformationChangeValidation,
  avatarChangeValidation,
} = require('../middlewares/validations');

router.get('/me', createUser);
router.get('/', getUsers);
router.get('/:userId', userIdValidation, getUserById);
router.patch('/me', userInformationChangeValidation, editUserInfo);
router.patch('/me/avatar', avatarChangeValidation, editAvatar);

module.exports = router;
