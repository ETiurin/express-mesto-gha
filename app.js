const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env; const app = express();

mongoose.connect(DB_URL);

app.use((req, res, next) => {
  req.user = {
    _id: '64cd269417e048e2a7b413a1',
  };

  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use('/users', userRoute);
app.use('/cards', cardRoute);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не неайдена' });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
