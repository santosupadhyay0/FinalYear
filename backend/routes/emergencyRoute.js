const express = require('express');
const { sendEmergencyAlert } = require('../controllers/emergencyController');

const router = express.Router();

router.post('/send-alert', sendEmergencyAlert);

module.exports = router;