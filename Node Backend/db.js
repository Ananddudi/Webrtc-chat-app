const mongoose = require("mongoose");

function runDB() {
  mongoose
    .connect(process.env.MONGODB)
    .then((_) => {
      console.log("Database connection is fine");
    })
    .catch((error) => {
      console.log("Database connection error", error.message);
    });
}

module.exports = runDB;
