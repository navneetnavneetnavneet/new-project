const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { sendMessage, allMessages } = require("../controllers/messageControllers");
const router = express.Router();

router.post("/", isAuthenticated, sendMessage);

router.get("/:chatId", isAuthenticated, allMessages);

module.exports = router;
