const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { loginValidation, createUserValidation } = require('./middlewares/validations');
const { NotFoundError } = require('./errors');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env; const app = express();

const {
  login,
  createUser,
} = require('./controllers/users');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const entryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(entryLimiter);
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
})
  .then(() => console.log(`Подключена база данных по адресу ${DB_URL}`))
  .catch((err) => console.log(err));

app.use(auth);
app.use('/users', userRoute);
app.use('/cards', cardRoute);
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.all('*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
