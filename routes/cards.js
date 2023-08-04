const router = require('express').Router();
const {
  getInitialCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
} = require('../controllers/cards');

router.get('/', getInitialCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', disLikeCard);

module.exports = router;
