//Import Packages
const express = require("express"); //return a method
const morgan = require("morgan");
const movieRouter = require("./Routes/moviesRoutes");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./Controllers/errorController");

let app = express(); //Call Express() method

app.use(express.json()); //use middleware
// app.use(express.static("./public"));
app.use(morgan("dev")); //morgan middleware called
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
}); //custom middleware where date is added in req parameter

//Using Routes Endpoint
app.use("/api/v1/movies", movieRouter);

//Defaults Route
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   Status: "Fail",
  //   Message: `Can't find ${req.originalUrl} on the server!`,
  // });

  //Initiate Global error handler middleware object
  // const err = new Error(`'Can't find ${req.originalUrl} on the server!`);
  // (err.status = "fail"), (err.statusCode = 400);

  //Initiate Global error handler middleware object
  const err = new CustomError(
    `'Can't find ${req.originalUrl} on the server!`,
    404
  );

  next(err); //call global error handler middleware
});

//Creating global error handling middleware
// app.use((error, req, res, next) => {
//   error.statusCode = error.statusCode || 500;
//   error.status = error.status || "error";
//   res.status(error.statusCode).json({
//     status: error.status,
//     Messsage: error.message,
//   });
// });//Use in errorController file

//Use globalErrorHandler middleware of errorContrller file
app.use(globalErrorHandler);

module.exports = app;
