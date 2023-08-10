const jwt = require('jsonwebtoken');

const {
  UNAUTHORIZED_ERROR_CODE,
  SECRET_KEY,
} = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.cookies;
  if (!authorization) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: 'Необходима авторизация!' });
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: 'Необходима авторизация!' });
  }

  req.user = payload;
  next();
  return req.user;
};
