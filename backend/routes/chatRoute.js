const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

// Use auth middleware to protect chat routes
router.use(authMiddleware);

// Send a new message
router.post("/send", chatController.sendMessage);

// Get all messages between sender and receiver
router.get("/", chatController.getMessages);

// Optional: Delete a message by id
router.delete("/:id", chatController.deleteMessage);

// Optional: Edit/update a message by id
router.put("/:id", chatController.editMessage);

module.exports = router;
