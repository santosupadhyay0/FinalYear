const express = require('express');
const { register, login } = require('../controllers/authController');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/register', register); 
router.post('/login', login);


router.get('/register/users', async (req, res) => {
  try {
    const users = await User.find(); // get all users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});
const { refreshAccessToken } = require('../controllers/authController');
router.post('/refresh', refreshAccessToken);



module.exports = router;
