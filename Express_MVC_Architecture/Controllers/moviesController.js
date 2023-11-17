const Movie = require("./../Models/moviesModel");

exports.getHighestRated = (req, res, next) => {
  req.query.sort = "-ratings";
  req.query.limit = "5";
  next();
};
//GET All MOVIES
exports.getAllMovies = async (req, res) => {
  try {
    console.log(req.query);

    // const movies = await Movie.find(req.query);

    //Exclude query object property
    const excludeFields = ["sort", "page", "limit", "fields"];
    const queryObj = { ...req.query };
    excludeFields.forEach((el) => {
      delete queryObj[el];
    });
    // console.log(queryObj);
    // const movies = await Movie.find(queryObj);

    // console.log(movies);

    //Using Mongoose Special method
    // const movies = await Movie.find()
    //   .where("duration")
    //   .equals(req.query.duration)
    //   .where("ratings")
    //   .equals(req.query.ratings);

    //Advance filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);
    console.log(queryStr);
    // const movies = await Movie.find(queryStr);
    //Using Mongoose Special method
    // const movies = await Movie.find()
    //   .where("duration")
    //   .equals(queryStr.duration)
    //   .where("ratings")
    //   .equals(queryStr.ratings)
    //   .where("price")
    //   .equals(queryStr.price);

    // Using Mongoose Special method2
    //In this case pass the query as simply with equal to(=)
    // const movies = await Movie.find()
    //   .where("duration")
    //   .gte(req.query.duration)
    //   .where("ratings")
    //   .gte(req.query.ratings)
    //   .where("price")
    //   .lte(queryStr.price);

    //Sorting result
    let query = Movie.find(queryStr);
    // console.log(sortedBy);
    if (req.query.sort) {
      const sortedBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortedBy);
    }

    // Limitting Fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      //   console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Implement Pagination

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    //page 1: 1-10, page 2:11-20, page 3:21-30
    const skip = (page - 1) * limit;
    // console.log(skip);
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const movieCount = await Movie.countDocuments();
      console.log("movie count :", movieCount);
      if (skip >= movieCount) {
        throw new Error("This Page is not found!");
      }
    }
    // console.log(query);
    const movies = await query;
    // console.log(movies);

    if (!movies.length) throw new Error("No Movies Found");
    res.status(200).json({
      Status: "Success",
      Length: movies.length,
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
