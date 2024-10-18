const express = require("express");
const { loginUser, registerUser, allUser } = require("../controllers/userControllers");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.get("/", isAuthenticated, allUser);

router.post("/", registerUser);

router.post("/login", loginUser);

module.exports = router;
