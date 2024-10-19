const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const router = express.Router();

router.post("/", isAuthenticated, accessChat);

router.get("/", isAuthenticated, fetchChats);

router.post("/group", isAuthenticated, createGroupChat);

router.post("/rename", isAuthenticated, renameGroup);

// router.get("/groupadd", isAuthenticated, addToGroup);

// router.get("/groupremove", isAuthenticated, removeFromGroup);

module.exports = router;
