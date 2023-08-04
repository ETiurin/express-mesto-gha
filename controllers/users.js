const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка: Неверные данные' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Ошибка: Неверные данные' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

const editUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: ' Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(400).send({ message: ' Переданы некорректные данные при обновлении аватара.' });
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка: Неверные данные.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  editUserInfo,
  editAvatar,
};
