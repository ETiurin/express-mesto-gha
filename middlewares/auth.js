const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorizedError');
const { SECRET_KEY } = require('../utils/constants');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new UnauthorizedError('Ошибка авторизации.');
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new UnauthorizedError('Ошибка авторизации.');
  }

  req.user = payload;

  return next();
};
