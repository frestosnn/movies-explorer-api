const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../../middlewares/auth');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../../controllers/movies');

const linkRegex = /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.\w+))(:\d{2,5})?((\/.+)+)?\/?#?/;

router.get('/', auth, getMovies);

router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.number().required(),
      description: Joi.string().required(),
      image: Joi.string().regex(linkRegex).required(),
      trailerLink: Joi.string().regex(linkRegex).required(),
      thumbnail: Joi.string().regex(linkRegex).required(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

router.delete(
  '/:movieID',
  auth,
  celebrate({
    params: Joi.object().keys({
      movieID: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
