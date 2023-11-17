const Movie = require("./../Models/moviesModel");
const ApiFeatures = require("./../utils/apiFeatures");
const CustomError = require("./../utils/CustomError");

exports.getHighestRated = (req, res, next) => {
  req.query.sort = "-ratings";
  req.query.limit = "5";
  next();
};
//GET All MOVIES
exports.getAllMovies = async (req, res, next) => {
  try {
    // console.log(req.query);
    const features = new ApiFeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //Exclude query object property
    // const excludeFields = ["sort", "page", "limit", "fields"];
    // const queryObj = { ...req.query };
    // excludeFields.forEach((el) => {
    //   delete queryObj[el];
    // });

    // if (req.query.page) {
    //   const movieCount = Movie.countDocuments();
    //   //   console.log("movie count :", movieCount);
    //   if (features.paginate().skip >= movieCount) {
    //     throw new Error("This Page is not found!");
    //   }
    // }
    const movies = await features.query;
    // console.log(movies);

    // if (!movies.length) throw new Error("No Movies Found");
    res.status(200).json({
      Status: "Success",
      Length: movies.length,
      Data: {
        movies,
      },
    });
  } catch (err) {
    // res.status(404).json({
    //   Status: "Fail",
    //   Message: err.message,
    // });

    //Initiate Global error handler middleware object
    const error = new CustomError(err.message, 400);
    next(error); //call global error handler middleware
  }
};

//GET SINGLE MOVIES
exports.getmovie = async (req, res) => {
  try {
    //const movie=await Movie.find({_id:req.params.id});
    const movie = await Movie.findById(req.params.id);
    if (!movie) throw new Error("No id Found");
    res.status(200).json({
      Status: "Success",
      Data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      Status: "Fail",
      Message: err.message,
    });
  }
};

//POST MOVIE
exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      //201 is created status
      Status: "Success",
      Data: {
        movie,
      },
    });
  } catch (err) {
    res.status(400).json({
      //400 is Bad status
      Status: "Fail",
      Message: err.message,
    });
  }
};

//PATCH MOVIE
exports.updateMovie = async (req, res) => {
  try {
    const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateMovie) throw new Error("No id Found");
    res.status(200).json({
      Status: "Success",
      Data: {
        movie: updateMovie,
      },
    });
  } catch (err) {
    res.status(404).json({
      Status: "Fail",
      Message: err.message,
    });
  }
};

//DELETE MOVIE
exports.deleteMovie = async (req, res) => {
  try {
    const deleteMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deleteMovie) throw new Error("No id Found");

    res.status(204).json({
      Status: "Success",
      Data: null,
    });
  } catch (err) {
    res.status(404).json({
      Status: "Fail",
      Message: err.message,
    });
  }
};

exports.getMovieStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      Status: "Fail",
      Message: err.message,
    });
  }
};

exports.getMovieByGenre = async (req, res) => {
  try {
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

    res.status(200).json({
      Status: "Success",
      Count: movies.length,
      Data: {
        movies,
      },
    });
  } catch (err) {
    res.status(404).json({
      Status: "Fail",
      Message: err.message,
    });
  }
};
