const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    convId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      maxlength: 1000,
      minlength: "1",
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio"],
      default: "text",
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;
