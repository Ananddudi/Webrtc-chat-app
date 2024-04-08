const mongoose = require("mongoose");
const validator = require("validator");

const connectionSchema = new mongoose.Schema(
  {
    callerEmail: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },
    answererEmail: {
      type: String,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },
    callerSdpOffer: {
      type: Object,
    },
    answererSdpOffer: {
      type: Object,
    },
    callerIceCandidates: [mongoose.Schema.Types.Mixed],
    answererIceCandidates: [mongoose.Schema.Types.Mixed],
    deletion: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("connection", connectionSchema);

module.exports = model;
