const mongoose = require("mongoose");

const convSchema = new mongoose.Schema(
  {
    usersArray: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          require: true,
        },
      ],
      required: true,
    },
    deleteStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

convSchema.virtual("LastMessage", {
  ref: "message",
  localField: "_id",
  foreignField: "convId",
  justOne: true,
  options: {
    sort: {
      createdAt: -1,
    },
  },
});

const convModel = mongoose.model("conversation", convSchema);

module.exports = convModel;
