const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const movie = require("./Models/moviesModel");

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("Data DB Connection Successful");
  })
  .catch((err) => {
    console.log("Some error Occured");
  });

//Read the file
const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));
// console.log(movies);

//Delete Existing Movie Document from Database collectionn
const deleteMovies = async () => {
  try {
    await movie.deleteMany();
    console.log("Data successfully deleted");
  } catch (error) {
    console.log(error.messsage);
  }
  process.exit();
};

//Import Movies data to MongoDB
const importMovies = async () => {
  try {
    await movie.create(movies);
    console.log("Data Successfully imported");
  } catch (error) {
    console.log(error.messsage);
  }
  process.exit();
};
console.log(process.argv);
if (process.argv[2] === "--import") {
  importMovies();
}
if (process.argv[2] === "--delete") {
  deleteMovies();
}

//To Call the delete and import function
// deleteMovies();
//importMovies();
