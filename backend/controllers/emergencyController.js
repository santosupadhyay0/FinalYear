const EmergencyAlert = require('../models/EmergencyAlert');
const twilio = require('twilio'); // For SMS alerts
const axios = require('axios'); // For reverse geocoding

// Initialize Twilio (sign up at twilio.com for free credits)
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.triggerSOS = async (req, res) => {
  try {
    const { userId, coordinates } = req.body; // { lat, lng }

    // 1. Save emergency to database
    const alert = new EmergencyAlert({
      userId,
      location: {
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat]
      },
      status: 'active'
    });
    await alert.save();

    // 2. Get nearest hospital (mock API - replace with real data)
    const hospitals = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}`
    );

    // 3. Send SMS to emergency contacts
    await client.messages.create({
      body: `🚨 EMERGENCY ALERT! User ${userId} at ${hospitals.data.display_name}`,
      to: '+97798XXXXXXX', // Replace with hospital/contact number
      from: process.env.TWILIO_PHONE_NUMBER
    });

    res.status(200).json({
      success: true,
      message: 'Emergency alert sent with location!',
      hospital: hospitals.data.display_name
    });

  } catch (err) {
    console.error('SOS Error:', err);
    res.status(500).json({ error: 'Emergency failed. Try again!' });
  }
};

exports.sendEmergencyAlert = async (req, res) => {
  const { message, contacts } = req.body;

  if (!message || !contacts || contacts.length === 0) {
    return res.status(400).json({ error: 'Message and contacts are required.' });
  }

  try {
    const alert = new EmergencyAlert({ message, contacts });
    await alert.save();

    // Simulate sending alerts to contacts (e.g., via SMS or push notifications)
    console.log(`Emergency alert sent to: ${contacts.join(', ')}`);

    res.status(200).json({ message: 'Emergency alert sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send emergency alert.' });
  }
};