const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Неправильный ID" });
      }
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некоректные данные для обновления профиля",
        });
      }
    });
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        email,
        password: hash,
        name,
      });
    })
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некоректные данные при создании пользователя",
        });
      }
      if (err.code === 11000) {
        return res
          .status(400)
          .send({ message: "Такой пользователь уже создан" });
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      bcrypt.compare(password, user.password, (err, matched) => {
        if (!matched) {
          return res.send("Пароль или email не верный");
        }

        const token = jwt.sign({ _id: user._id }, "secret", {
          expiresIn: "7d",
        });

        return res.status(200).send({ token });
      });
    })

    .catch((err) => {
      return res.status(500).send("Ошибка");
    });
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
};
