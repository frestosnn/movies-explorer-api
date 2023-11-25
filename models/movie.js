const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },

  director: {
    type: String,
    require: true,
  },

  duration: {
    type: Number,
    require: true,
  },

  year: {
    type: Number,
    require: true,
  },

  description: {
    type: String,
    require: true,
  },

  image: {
    type: String,
    require: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },

  trailerLink: {
    type: String,
    require: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },

  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'user',
  },

  movieId: {
    type: Number,
    require: true,
  },

  nameRU: {
    type: String,
    require: true,
  },

  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
