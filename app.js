const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');

const { movieRouter, userRouter } = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const PathError = require('./errors/path-errors');
const auth = require('./middlewares/auth');
const limiter = require('./middlewares/rare-limiter');

const { PORT = 3000, BD = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(cors());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.disable('x-powered-by');

mongoose.connect(BD);

app.use(requestLogger);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use('/movies', movieRouter);
app.use('/users', userRouter);

app.use(auth);

app.use((req, res, next) => {
  next(new PathError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
