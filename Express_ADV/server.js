const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = require("./app");
require("colors");

//Connecting MongoDb with Express.Js
const connectDatabase = require("./DB/dbConnection");
connectDatabase();

//Create Server
const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`✅ Server has started at Port ${port} `.bgCyan.white);
});
