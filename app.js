const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { entryLimiter } = require('./middlewares/rateLimit');
const { loginValidation, createUserValidation } = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundError');
const { login, createUser } = require('./controllers/users');
const { errorHandler } = require('./middlewares/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
mongoose.connect(DB_URL);

const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(entryLimiter);

app.use('/users', userRoute);
app.use('/cards', cardRoute);
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use((req, res, next) => next(new NotFoundError('Страница не найдена')));
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
