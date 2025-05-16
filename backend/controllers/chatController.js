const Chat = require('../models/Chat');

// @desc    Send a message
// @route   POST /api/chat/send
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const chat = new Chat({ senderId, receiverId, message });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
};

// @desc    Get messages between two users
// @route   GET /api/chat/:user1Id/:user2Id
exports.getMessages = async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    const messages = await Chat.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get messages', error: err.message });
  }
};
