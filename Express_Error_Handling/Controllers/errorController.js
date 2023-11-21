const CustomError = require("./../utils/CustomError");

// //Creating a simple global error handling middleware
// module.exports = (error, req, res, next) => {
//   error.statusCode = error.statusCode || 500;
//   error.status = error.status || "error";
//   res.status(error.statusCode).json({
//     status: error.status,
//     Message: error.message,
//   });
// };

//Createing global error handling middleware with categarised with development and prodection error
//Development error function
const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    Message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

//Production error function
const prodErrors = (res, error) => {
  //for Operational error
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      Message: error.message,
    });
  } else {
    //For Mongoose error
    res.status(500).json({
      status: "error",
      Message: "Something went wrong! Please try again.",
    });
  }
};

//Cast Error Handler Function
const castErrorHandler = (err) => {
  const msg = `Invalid Value ${err.value} for field ${err.path}!`;
  return new CustomError(msg, 400);
};

const duplicateErrorHandler = (err) => {
  const name = err.keyValue.name;
  const msg = `There is already a movie with name ${name}. Please use another name!`;
  return new CustomError(msg, 400);
};

const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessage = errors.join("._");
  const msg = `Invalid input data : ${errorMessage}`;
  return new CustomError(msg, 400);
};

// global error handling middleware
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  // console.log("global error block call");
  if (process.env.NODE_ENV === "development") {
    // console.log("dev error block call");
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    // let err = { ...error, name: error.name };
    // console.log(err);
    if (error.name === "CastError") {
      error = castErrorHandler(error);
    }
    if (error.code === 11000) {
      error = duplicateErrorHandler(error);
    }
    if (error.name === "ValidationError") {
      error = validationErrorHandler(error);
    }
    prodErrors(res, error);
  }
};
