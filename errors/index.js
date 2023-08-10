const { NotFoundError } = require('./NotFoundError');
const { ConflictError } = require('./ConflictError');
const { BadRequestError } = require('./BadRequestError');
const { UnauthorizedError } = require('./UnauthorizedError');
const { ForbiddenError } = require('./ForbiddenError');

module.exports = {
  NotFoundError,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
};
