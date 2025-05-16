const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');

// ✅ Register Route
exports.register = async (req, res) => {
  try {
    const { name, email, password, age, specialization } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword, age, specialization });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      message: 'User registered',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token: accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Login Route
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        specialization: user.specialization,
        age: user.age,
      },
      token: accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Refresh Access Token Route
exports.refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};
