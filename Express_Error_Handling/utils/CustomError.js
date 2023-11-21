//Custom Error class
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode <= 500 ? "fail" : "error";

    this.isOperational = true; // For Operational error set true
    Error.captureStackTrace(this, this.constructor); // set stack trace
  }
}

module.exports = CustomError;
