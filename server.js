const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
const verifyFolders = require("./utils/folder")

const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(3000, function () {
      verifyFolders()
      console.log(
        "Database connection successful. Server running. Use our API on port: 3000"
      );
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
