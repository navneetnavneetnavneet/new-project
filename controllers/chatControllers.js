const { catchAsyncError } = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

module.exports.accessChat = catchAsyncError(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return next(new ErrorHandler("UserId params not sent with request !", 400));
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.senderId",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.json(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users"
      );

      res.status(200).json(fullChat);
    } catch (error) {
      console.log(error);
    }
  }
});

module.exports.fetchChats = catchAsyncError((req, res, next) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.id } } })
      .populate("users")
      .populate("groupAdmin")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.senderId",
          select: "name pic email",
        });

        res.json(results);
      });
  } catch (error) {
    console.log(error);
  }
});

module.exports.createGroupChat = catchAsyncError(async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    return next(new ErrorHandler("Please fill all the fields !", 500));
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return next(
      new ErrorHandler(
        "More then two users are required from a group chat !",
        400
      )
    );
  }

  const user = await User.findById(req.id);
  users.push(user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users")
      .populate("groupAdmin");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);
  }
});

module.exports.renameGroup = catchAsyncError(async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users")
      .populate("groupAdmin");

    res.status(200).json(updatedChat);
  } catch (error) {
    console.log(error);
  }
});

module.exports.addToGroup = catchAsyncError(async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users")
      .populate("groupAdmin");

    res.status(200).json(added);
  } catch (error) {
    console.log(error);
  }
});

module.exports.removeFromGroup = catchAsyncError(async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users")
      .populate("groupAdmin");

    res.status(200).json(removed);
  } catch (error) {
    console.log(error);
  }
});
