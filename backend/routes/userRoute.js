const express = require('express');
const router = express.Router();

const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Search doctors and patients by name or email (case-insensitive)
// @route   GET /api/search?query=...
// @access  Public (add auth if needed)
router.get('/', async (req, res) => {
  const query = req.query.query || '';

  try {
    // Search doctors
    const doctors = await Doctor.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).select('name email profilePic specialization');

    // Search patients
    const patients = await Patient.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).select('name email profilePic spouse');

    // Combine results with a type field to identify user type
    const results = [
      ...doctors.map(doc => ({ ...doc.toObject(), userType: 'Doctor' })),
      ...patients.map(pat => ({ ...pat.toObject(), userType: 'Patient' })),
    ];

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

// @desc    Get user by ID (Doctor or Patient)
// @route   GET /api/users/:id
// @access  Public (add auth if needed)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Search for the user in both collections
    const doctor = await Doctor.findById(id).select('name email profilePic specialization');
    if (doctor) return res.json({ ...doctor.toObject(), userType: 'Doctor' });

    const patient = await Patient.findById(id).select('name email profilePic spouse');
    if (patient) return res.json({ ...patient.toObject(), userType: 'Patient' });

    res.status(404).json({ message: 'User not found' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

module.exports = router;
