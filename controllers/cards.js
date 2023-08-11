const Card = require('../models/card');

const { CREATED_OK_CODE } = require('../utils/constants');

const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require('../errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED_OK_CODE).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else { next(error); }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (card.owner.toString() === userId) {
        Card.deleteOne({ _id: cardId })
          .then((deleteCardById) => {
            if (deleteCardById === null) {
              throw new NotFoundError(`Карточка с указанным _id: ${cardId} не найдена.`);
            } else { res.send({ message: 'Карточка удалена.' }); }
          });
      } else { throw new ForbiddenError('Доступ запрещен.'); }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
      } else if (error.name === 'TypeError') {
        next(new NotFoundError(`Карточка с указанным _id: ${cardId} не найдена.`));
      } else { next(error); }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      } else { res.send({ data: card }); }
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } else { next(error); }
    });
};

module.exports.disLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      } else { res.send({ data: card }); }
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления лайка.'));
      } else { next(error); }
    });
};
