const Notification = require('../models/Notification');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { user, type, message } = req.body;

    const notification = new Notification({
      user,
      type,
      message,
    });

    await notification.save();
    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error('Error in createNotification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ user: userId }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};