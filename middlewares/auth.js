const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../errors');
const { SECRET_KEY } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.cookies;
  if (!authorization) {
    throw new UnauthorizedError('Необходима авторизация.');
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация!'));
  }

  req.user = payload;
  next();
  return req.user;
};
