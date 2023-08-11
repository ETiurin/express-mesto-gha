const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { SECRET_KEY } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Не передан электронный адрес или пароль'));
  }
  bcrypt.hash(req.body.password, 8)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user.id,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(`Пользователь по указанному id:${userId} не найден.`);
      } else {
        res.send({ message: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`Передан некорректный id:${userId} пользователя.`));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  const { userId } = req.user._id;
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному id:${userId} не найден.`);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`Передан некорректный id:${userId} пользователя.`));
      } else {
        next(err);
      }
    });
};

const editUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные при обновлении профиля.' }));
      } else {
        next(err);
      }
    });
};

const editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не зарегистрирован');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные при обновлении аватара.' }));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!email || !password) {
        next(new UnauthorizedError('Ошибка авторизации'));
      }
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      return res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .send({ message: 'Успешная авторизация' });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  getUserInfo,
  editUserInfo,
  editAvatar,
  login,
};
