const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, getDoctorAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware'); // Corrected import
const Appointment = require('../models/Appointment');

// Route to book an appointment
router.post('/', authMiddleware, bookAppointment); // Corrected middleware usage

// Route to get all appointments for a user
router.get('/', authMiddleware, getAppointments); // Corrected middleware usage

// Route to fetch appointments for a specific doctor
router.get('/doctor', authMiddleware, getDoctorAppointments);

// Route to update the status of an appointment
router.patch('/:appointmentId/status', authMiddleware, updateAppointmentStatus);

// Route to fetch all appointments in newest to oldest order
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .populate('userId', 'name email')
      .populate('doctorId', 'name specialization');

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all appointments',
      error: error.message,
    });
  }
});

module.exports = router;