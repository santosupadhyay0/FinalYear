const jwt = require('jsonwebtoken');
require('dotenv').config();

// Access Token: Valid for 7 days
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Refresh Token: Valid for 3 months
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '90d', // approx 3 months
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
