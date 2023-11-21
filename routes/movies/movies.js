const router = require("express").Router();
const auth = require("../../middlewares/auth");

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../../controllers/movies");

router.get("/", auth, getMovies);
router.post("/", auth, createMovie);
router.delete("/:movieId", auth, deleteMovie);

module.exports = router;
