const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  disLikeCard,
} = require('../controllers/cards');
const { cardIdValidation, createCardValidation } = require('../middlewares/validations');

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.delete('/:cardId', cardIdValidation, deleteCardById);
router.put('/:cardId/likes', cardIdValidation, likeCard);
router.delete('/:cardId/likes', cardIdValidation, disLikeCard);

module.exports = router;
