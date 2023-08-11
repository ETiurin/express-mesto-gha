const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { loginValidation, createUserValidation } = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
mongoose.connect(DB_URL, {});

const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');

app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());

app.use('/users', auth, userRoute);
app.use('/cards', auth, cardRoute);
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
