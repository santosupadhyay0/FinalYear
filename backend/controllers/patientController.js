const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerPatient = async (req, res) => {
  try {
    const { name, email, password, age, spouse } = req.body;

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) return res.status(400).json({ message: 'Patient already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      name,
      email,
      password: hashedPassword,
      age,
      spouse,
    });

    await newPatient.save();

    const token = jwt.sign({ id: newPatient._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: _, ...patientWithoutPassword } = newPatient._doc;

    res.status(201).json({ user: patientWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: _, ...patientWithoutPassword } = patient._doc;

    res.json({ user: patientWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-password');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updatedPatient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
