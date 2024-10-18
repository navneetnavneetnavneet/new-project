const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { accessChat, fetchChats, createGroupChat } = require("../controllers/chatControllers");
const router = express.Router();

router.post("/", isAuthenticated, accessChat);

// router.get("/", isAuthenticated, fetchChats);

// router.post("/group", isAuthenticated, createGroupChat);

// router.get("/rename", isAuthenticated, renameGroup);

// router.get("/groupremove", isAuthenticated, removeFromGroup);

// router.get("/groupadd", isAuthenticated, addToGroup);


module.exports = router;
