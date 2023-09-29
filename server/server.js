////////////////////
// Global
////////////////////

console.log("hio")

const mongoose = require("mongoose");
require("dotenv").config();

////////////////////
// Components
////////////////////

const app = require("./app");

////////////////////
// Body
////////////////////

// Compiling the database connection string
const DB = process.env.DATABASE.replace("<user>", process.env.DATABASE_USER)
  .replace("<password>", process.env.DATABASE_PASSWORD)
  .replace("<project>", process.env.DATABASE_PROJECT);

// Connecting to the database
mongoose
  .connect(DB)
  // Success
  .then(() => {
    console.log("Connected successfully to the DB");
    // Server connection
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  })
  // Error
  .catch((err) => {
    console.log(`Could not connect to the DB`, `Messsage: ${err.message}`);
  });
