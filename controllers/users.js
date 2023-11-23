const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ValidationError = require("../errors/validation-erroes");
const PathError = require("../errors/path-errors");
const BdError = require("../errors/bd-errors");
const UnauthorizedError = require("../errors/unauthorized-errors");
const { JWT = "secret-key", NODE_ENV = "production" } = process.env;

// возврат текущего пользователя
const getUser = (req, res, next) => {
  User.findById(req.user._id)

    .orFail(new PathError("Пользователь не найден"))

    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};

// обновление информации о пользователе
const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(new PathError("Пользователь не найден"))

    .then((user) => {
      res.status(200).send(user);
    })

    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new ValidationError(
            "Переданы некоректные данные для обновления профиля"
          )
        );
      }
      return next(err);
    });
};

// создание пользователя
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
      })
    )
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new ValidationError(
            "Переданы некоректные данные при создании пользователя"
          )
        );
      }

      if (err.code === 11000) {
        return next(new BdError("Такой пользователь уже создан"));
      }

      return next(err);
    });
};

// аутентификация
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select("+password")

    .orFail(new PathError("Пользователь не найден"))

    .then((user) => {
      bcrypt.compare(password, user.password, (err, matched) => {
        if (!matched) {
          return next(new UnauthorizedError("Пароль или email не верный"));
        }

        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT : "dif-secret",
          {
            expiresIn: "7d",
          }
        );

        return res.status(200).send({ token });
      });
    })

    .catch((err) => next(err));
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
};
