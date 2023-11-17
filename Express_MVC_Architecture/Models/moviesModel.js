const mongoose = require("mongoose");

//Creating Simple Schema
// const movieSchema=new mongoose.Schema({
//     name:String,
//     description:String,
//     duration:Number,
//     rating:Number
// });

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required field!"],
    unique: true,
    trim: true, //To remove white Spaces from start and end
  },
  description: {
    type: String,
    required: [true, "Description is required field!"],
    trim: true, //To remove white Spaces from start and end
  },
  duration: {
    type: Number,
    required: [true, "Duration is required field!"],
  },
  ratings: {
    type: Number,
    // default:1.0,
    // max: [5, 'Must be less than 5, got {VALUE}']
  },
  totalRating: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    required: [true, "Release year is required field!"],
  },
  releaseDate: {
    type: Date,
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  genres: {
    type: [String],
    required: [true, "Genress is required field!"],
  },
  directors: {
    type: [String],
    required: [true, "Directors is required field!"],
  },
  coverImage: {
    type: String,
    required: [true, "Cover Image is required field!"],
  },
  actors: {
    type: [String],
    required: [true, "Actors is required field!"],
  },
  price: {
    type: Number,
    required: [true, "Price is required field!"],
  },
});

//Creating Model based on schema
const Movie = mongoose.model("Movie", movieSchema);

// //Creating document from model
// const testMovie= Movie({
//     name:'Ram',
//     description:'Action packed movie of sunny deol',
//     duration:120,
//     rating:4.4
// });

// //Save movie document in database
// testMovie.save().then(doc=>{
//     console.log(doc);
// }).catch(err=>{
//     console.log('Error occured '+err);
// });
module.exports = Movie;
