const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel", // dynamic reference (doctor or patient)
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel", // dynamic reference (doctor or patient)
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Doctor", "Patient"],
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["Doctor", "Patient"],
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
