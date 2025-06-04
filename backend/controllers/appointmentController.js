const Appointment = require('../models/Appointment');

// Controller to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, reason } = req.body;

    console.log("Incoming request payload:", req.body); // Debug log

    // Validate required fields
    if (!doctorId || !date || !reason) {
      console.error("Validation error: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields: doctorId, date, or reason",
      });
    }

    // Create a new appointment
    const appointment = await Appointment.create({
      userId: req.userId, // Ensure req.userId is set by authMiddleware
      doctorId,
      date,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error.message); // Detailed error log
    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
      error: error.message,
    });
  }
};

// Controller to get all appointments for a user
const getAppointments = async (req, res) => {
  try {
    console.log("Fetching appointments for user:", req.user._id); // Debug log

    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('doctorId', 'name specialization');

    console.log("Fetched appointments:", appointments); // Debug log

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error.message); // Detailed error log
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
};

// Controller to get all appointments for a doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.userId; // Ensure `authMiddleware` sets `req.userId`

    const appointments = await Appointment.find({ doctorId })
      .populate('userId', 'name email')
      .sort({ date: -1 }); // Sort by date in descending order

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor appointments',
      error: error.message,
    });
  }
};

// Controller to update the status of an appointment
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    console.log("Incoming request parameters:", req.params);
    console.log("Incoming request body:", req.body);

    // Validate required fields
    if (!appointmentId || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: appointmentId or status",
      });
    }

    // Update the appointment status
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // If the status is confirmed or cancelled, delete the appointment
    if (status === "confirmed" || status === "cancelled") {
      await Appointment.findByIdAndDelete(appointmentId);
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
};

// Controller to fetch all appointments in newest to oldest order
const getAllAppointments = async (req, res) => {
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
};

module.exports = {
  bookAppointment,
  getAppointments,
  getDoctorAppointments,
  updateAppointmentStatus, // Export the new controller
  getAllAppointments, // Export the new controller
};