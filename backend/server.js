const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors');
const User = require('./models/User');
const authMiddleware = require('./middleware/authMiddleware');
const router = express.Router(); 

require('dotenv').config();

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/chat', require('./routes/chatRoute'));


router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});


// Add after middleware
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/health', require('./routes/healthRoute'));
app.use('/api/emergency', require('./routes/emergencyRoute'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
  
  