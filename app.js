require("dotenv").config({
  path: "./.env",
});
const express = require("express");
const app = express();
const logger = require("morgan");
const ErrorHandler = require("./utils/ErrorHandler");
const { generateErrors } = require("./middlewares/errors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");

// db connection
require("./config/db").connectDatabase();

// body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// logger
app.use(logger("tiny"));

// cors
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// session and cookie-parser
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SCERET,
  })
);
app.use(cookieParser());

// routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

// Error Handling
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404));
});
app.use(generateErrors);

// create server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("setup", (userData) => {
    // console.log(userData._id);

    socket.join(userData._id);
    socket.emit("connected");
  });
});
