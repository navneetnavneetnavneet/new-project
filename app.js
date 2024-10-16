require("dotenv").config({
  path: "./.env",
});
const express = require("express");
const app = express();
const logger = require("morgan");

// db connection
require("./config/db").connectDatabase();

// logger
app.use(logger("tiny"));

// routes
app.use("/api/users", require("./routes/indexRoutes"));

// create server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
