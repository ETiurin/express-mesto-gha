const rateLimit = require('express-rate-limit');

const entryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = entryLimiter;
