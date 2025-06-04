const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password, age, specialization, doctorValidationId, levelOfStudy, workplace } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: 'Doctor already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      age,
      specialization,
      doctorValidationId,
      levelOfStudy,
      workplace
    });

    await newDoctor.save();

    const token = jwt.sign({ id: newDoctor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: _, ...doctorWithoutPassword } = newDoctor._doc;

    res.status(201).json({ user: doctorWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: _, ...doctorWithoutPassword } = doctor._doc;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ user: doctorWithoutPassword, token }); // Added token to the response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const updateData = req.body;

    // Check if a file is uploaded
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`; // Save the file path
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');

    res.json(updatedDoctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found' });
    }
    res.json(doctors);
  } catch (err) {
    console.error('Error fetching doctors:', err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
