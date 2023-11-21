const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectDatabase = () => {
  mongoose
    .connect(process.env.CONN_STR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((con) => {
      // console.log(con);
      console.log("Database Connected to the Collection ✅ ".bgMagenta.white);
    })
    .catch((err) =>
      console.error(`Some error has occured ${err} `.bgRed.white)
    );
};

module.exports = connectDatabase;
