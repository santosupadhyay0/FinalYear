const Chat = require("../models/Chat"); // Your chat mongoose model
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  console.log("Request Body:", req.body);

  // Validate senderId and receiverId
  const senderExists = await Doctor.findById(senderId) || await Patient.findById(senderId);
  const receiverExists = await Doctor.findById(receiverId) || await Patient.findById(receiverId);

  if (!senderExists || !receiverExists) {
    return res.status(400).json({ message: "Invalid senderId or receiverId" });
  }

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Determine senderModel and receiverModel
    const senderModel = senderExists instanceof Doctor ? 'Doctor' : 'Patient';
    const receiverModel = receiverExists instanceof Doctor ? 'Doctor' : 'Patient';

    const newMessage = new Chat({
      senderId,
      receiverId,
      senderModel,
      receiverModel,
      message,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "senderId and receiverId required" });
  }

  try {
    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }); // sorted by oldest first

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Chat.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message", error });
  }
};

exports.editMessage = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message content required" });
  }

  try {
    const updatedMessage = await Chat.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to update message", error });
  }
};
