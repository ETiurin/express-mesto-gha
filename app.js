const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardRoute = require('./routes/cards');
const userRoute = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64cd269417e048e2a7b413a1',
  };

  next();
});

app.use('/cards', cardRoute);
app.use('/users', userRoute);

app.listen(PORT, () => {
  console.log(`Link to port ${PORT}`);
});
