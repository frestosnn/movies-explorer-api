const PathError = require('../errors/path-errors');
const RightError = require('../errors/rights-errors');
const ValidationError = require('../errors/validation-erroes');
const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch((err) => next(err));
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
      if (err.name === 'ValidationError') {
        return next(
          new ValidationError(
            'Переданы некорректные данные при создании фильма',
          ),
        );
      }

      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movie } = req.params;

  Movie.findByIdAndDelete(movie)
    .orFail(new PathError('Фильм не найден.'))

    .then(() => {
      if (movie.owner.toString() !== userId.toString()) {
        return next(new RightError('Отсутствуют права для удаления фильма'));
      }
      return res.status(200).send(movie);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new ValidationError(
            'Переданы некорректные данные для удаления фильма',
          ),
        );
      }

      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
