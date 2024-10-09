const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      //  useNewUrlParser: true,
      //  useUnifiedTopology: true,
    })
    .then(console.log("DB Connected Successfull"))

    .catch((error) => {
      console.log("Issues In DB Connection");
      console.error(error);
      process.exit(1);
    });
};
