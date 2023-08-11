const { celebrate, Joi } = require('celebrate');
const { REGEXP_URL } = require('../utils/constants');

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REGEXP_URL),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const userInformationChangeValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const avatarChangeValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(REGEXP_URL),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(REGEXP_URL).required(),
  }),
});

module.exports = {
  loginValidation,
  createUserValidation,
  userIdValidation,
  userInformationChangeValidation,
  avatarChangeValidation,
  cardIdValidation,
  createCardValidation,
};
