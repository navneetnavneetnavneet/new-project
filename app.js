require("dotenv").config({
  path: "./.env",
});
const express = require("express");
const app = express();
const logger = require("morgan");
const ErrorHandler = require("./utils/ErrorHandler");
const { generateErrors } = require("./middlewares/errors");

// db connection
require("./config/db").connectDatabase();

// logger
app.use(logger("tiny"));

// routes
app.use("/api/users", require("./routes/indexRoutes"));

// Error Handling
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404));
});
app.use(generateErrors);

// create server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
