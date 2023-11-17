const express = require("express");
const moviesController = require("./../Controllers/moviesController");

//Call ROUTE HANDLER FUNCTION WITH CHAINING
const router = express.Router(); //middleware

router
  .route("/highest-rated")
  .get(moviesController.getHighestRated, moviesController.getAllMovies);

router.route("/movie-stats").get(moviesController.getMovieStats);
router.route("/movie-by-genre/:genre").get(moviesController.getMovieByGenre);

router
  .route("/")
  .get(moviesController.getAllMovies)
  .post(moviesController.createMovie);

router
  .route("/:id")
  .get(moviesController.getmovie)
  .patch(moviesController.updateMovie)
  .delete(moviesController.deleteMovie);

module.exports = router;
