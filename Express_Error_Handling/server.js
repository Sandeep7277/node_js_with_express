const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

//Uncaught Exception Error Handler Function
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception Occured! Shutting down...");
  // server.close(() => {
  //   process.exit(1);
  // });
  process.exit(1);
});

const app = require("./app");
require("colors");

//Connecting MongoDb with Express.Js
const connectDatabase = require("./DB/dbConnection");
connectDatabase();

// console.log(app.get("env"));
console.log(process.env);

//Create Server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`✅ Server has started at Port ${port} `.bgCyan.white);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection Occured! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
