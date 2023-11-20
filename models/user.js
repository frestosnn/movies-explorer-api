const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  name: {
    type: String,
    require: true,
    minlength: [2, "Минимальная длина поля 2 символа"],
    maxlength: [30, "Максимальная длина поля 30 символов"],
  },
});

module.exports = mongoose.model("user", userSchema);
