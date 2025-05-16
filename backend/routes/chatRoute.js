const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Send a new message
router.post('/send', chatController.sendMessage);

// Get messages between two users
router.get('/:user1Id/:user2Id', chatController.getMessages);

module.exports = router;
