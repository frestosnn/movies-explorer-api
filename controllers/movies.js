const Movie = require("../models/movie");

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      return res.status(200).send(movies);
    })
    .catch((err) => {
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }
    });
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;

  Movie.findByIdAndRemove(req.params.movieId)
    .then((movie) => {
      if (movie.owner.toString() !== userId.toString()) {
        return next(new RightsError("Отсутствуют права"));
      }
      return res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для удаления карточки",
        });
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
