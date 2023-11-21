const CustomError = require("../utils/CustomError");
const Movie = require("./../Models/moviesModel");
const ApiFeatures = require("./../utils/apiFeatures");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");

// //async error handler funcction
// const asyncErrorHandler = (func) => {
//   return (req, res, next) => {
//     func(req, res, next).catch((err) => next(err));
//   };
// };

exports.getHighestRated = (req, res, next) => {
  req.query.sort = "-ratings";
  req.query.limit = "5";
  next();
};
//GET All MOVIES
exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.query);
  const features = new ApiFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const movies = await features.query;

  // if (!movies.length) throw new Error("No Movies Found");
  res.status(200).json({
    Status: "Success",
    Length: movies.length,
    Data: {
      movies,
    },
  });
});

//GET SINGLE MOVIES
exports.getmovie = asyncErrorHandler(async (req, res, next) => {
  //const movie=await Movie.find({_id:req.params.id});
  const movie = await Movie.findById(req.params.id);
  // if (!movie) throw new Error("No id Found");

  if (!movie) {
    const error = new CustomError("Movie with that ID is not found!", 404);
    return next(error);
  }
  res.status(200).json({
    Status: "Success",
    Data: {
      movie,
    },
  });
});

//POST MOVIE
exports.createMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.create(req.body);
  res.status(201).json({
    //201 is created status
    Status: "Success",
    Data: {
      movie,
    },
  });
});

//PATCH MOVIE
exports.updateMovie = asyncErrorHandler(async (req, res, next) => {
  const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // if (!updateMovie) throw new Error("No id Found");
  if (!updateMovie) {
    const error = new CustomError("Movie with that ID is not found!", 404);
    return next(error);
  }
  res.status(200).json({
    Status: "Success",
    Data: {
      movie: updateMovie,
    },
  });
});

//DELETE MOVIE
exports.deleteMovie = asyncErrorHandler(async (req, res, next) => {
  const deleteMovie = await Movie.findByIdAndDelete(req.params.id);

  // if (!deleteMovie) throw new Error("No id Found");
  if (!deleteMovie) {
    const error = new CustomError("Movie with that ID is not found!", 404);
    return next(error);
  }

  res.status(204).json({
    Status: "Success",
    Data: null,
  });
});

exports.getMovieStats = asyncErrorHandler(async (req, res, next) => {
  const stats = await Movie.aggregate([
    // { $match: { ratings: { $gte: 7 } } },
    //To Match only release date is less than current date otherwise it returns all movie while we use query middlewarethat doesnot return movie after release date.
    //To solve this porblem either we have to use this match pipeline or aggergation middleware
    // { $match: { releaseDate: { $lte: new Date() } } },
    {
      $group: {
        _id: null,
        // _id: "$releaseYear",
        avgRating: { $avg: "$ratings" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        totalPrice: { $sum: "$price" },
        movieCount: { $sum: 1 },
      },
    },
    { $sort: { minPrice: -1 } },
    // { $match: { maxPrice: { $gte: 60 } } },
  ]);

  res.status(200).json({
    Status: "Success",
    Data: {
      stats,
    },
  });
});

exports.getMovieByGenre = asyncErrorHandler(async (req, res, next) => {
  const genre = req.params.genre;
  // console.log(genre);
  const movies = await Movie.aggregate([
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        movieCount: { $sum: 1 },
        movies: { $push: "$name" },
      },
    },
    //To Add a fiels
    { $addFields: { genre: "$_id" } },
    //To Remove a field
    { $project: { _id: 0 } },
    { $sort: { movieCount: -1 } },
    { $limit: 3 },
    { $match: { genre: genre } },
  ]);

  if (!movies.length) {
    const error = new CustomError("Movie with that Genre is not found!", 404);
    return next(error);
  }
  console.log(movies);

  res.status(200).json({
    Status: "Success",
    Count: movies.length,
    Data: {
      movies,
    },
  });
});
