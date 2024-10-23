const { catchAsyncError } = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

module.exports.sendMessage = catchAsyncError(async (req, res, next) => {
  //   console.log(req.body);
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return next(new ErrorHandler("Invalid data passed into request !", 500));
  }

  try {
    let message = await Message.create({
      senderId: req.id,
      content: content,
      chat: chatId,
    });

    message = await message.populate("senderId", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(
      req.body.chatId,
      { latestMessage: message },
      { new: true }
    );

    res.status(201).json(message);
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});

module.exports.allMessages = catchAsyncError(async (req, res, next) => {
  console.log(req.params);

  const messages = await Message.find({ chat: req.params.chatId })
    .populate("senderId", "name pic email")
    .populate("chat");

  res.status(200).json(messages);
});
