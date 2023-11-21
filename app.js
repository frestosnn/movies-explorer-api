const express = require("express");
const mongoose = require("mongoose");
const { createUser, login } = require("./controllers/users");

const { movieRouter, userRouter } = require("./routes/index");

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/filmsdb");

app.post("/signup", createUser);
app.post("/signin", login);

app.use("/movies", movieRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
