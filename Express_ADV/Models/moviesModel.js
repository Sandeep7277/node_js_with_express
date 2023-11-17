const mongoose = require("mongoose");
const fs = require("fs");
const validator = require("validator");

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required field!"],
      unique: true, //Unique is technically not avalidator
      //maxlength and minlength only used with String Datatype
      maxlength: [100, "Movie name must not have more than 100 characters"],
      minlength: [4, "Movie name must have at least 4 characters"],
      trim: true, //To remove white Spaces from start and end
      //Custom validator of mongoose library
      validate: [validator.isAlpha, "Movie name should only contains alphabet"],
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
      // max: [10, "Ratings must be 10 or below, got {VALUE}"],
      // min: [1, "Ratings must be 1.0 or above, got {VALUE}"],

      //Custome validator to check min and max value
      // validate: function (VALUE) {
      //   return VALUE >= 1 && VALUE <= 10;
      // },

      //Custom validator with messsage
      // validate: {
      //   validator: function (VALUE) {
      //     return VALUE >= 1 && VALUE <= 10;
      //   },
      //   message: "Ratings ({VALUE}) should be from 1 to 10",
      // },

      //Custom validator with this keyword
      validate: {
        validator: function (VALUE) {
          //this will work only with create not in update method But Here work with update also
          return this.ratings <= 10;
        },
        message: "Ratings ({VALUE}) should be less than 10",
      },
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
      enum: {
        values: [
          "Action",
          "Adventure",
          "Sci-Fi",
          "Thriller",
          "Crime",
          "Drama",
          "Comedy",
          "Romance",
          "Biography",
        ],
        message: "{VALUE} genre does not exist",
      },
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
    createdBy: String,
  }
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // }
);
//Virtual Property of schema
// movieSchema.virtual("durationInHours").get(function () {
//   return this.duration / 60;
// });

//Document Middleware Execute Before Saved in DB
movieSchema.pre("save", function (next) {
  // console.log(this);
  this.createdBy = "SANDEEP";
  // console.log(this);
  next();
});

//Document Middleware Execute After Saved in DB
movieSchema.post("save", function (doc, next) {
  const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`;
  fs.writeFileSync("./Log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  next();
});

//Query Middleware Execute Before Find Document from DB
movieSchema.pre(/^find/, function (next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.startTime = Date.now();
  next();
});

//Query Middleware Execute After Find Document from DB
movieSchema.post(/^find/, function (docs, next) {
  // this.find({ releaseDate: { $lte: Date.now() } });
  this.endTime = Date.now();
  const content = `Query took ${
    this.endTime - this.startTime
  } milliseconds to fetch the documents.\n`;
  fs.writeFileSync("./Log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  next();
});

//Pre Aggergation middleware
movieSchema.pre("aggregate", function (next) {
  // console.log(this);
  this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } });
  next();
});

module.exports = mongoose.model("Movie", movieSchema);
