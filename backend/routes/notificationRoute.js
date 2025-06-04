const express = require('express');
const router = express.Router();
const {
  createNotification,
  getNotifications,
  markAsRead,
} = require('../controllers/notificationController');

// Create a new notification
router.post('/', createNotification);

// Get all notifications for a user
router.get('/:userId', getNotifications);

// Mark a notification as read
router.patch('/:notificationId', markAsRead);

module.exports = router;