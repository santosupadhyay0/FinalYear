const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');           // Node http server
const { Server } = require('socket.io'); // Socket.io server
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app); // create server from express app

// Setup CORS properly to allow socket.io from your frontend origin
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8081', // frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true,
}));

app.use('/api/health', require('./routes/healthRoute'));
app.use('/api/emergency', require('./routes/emergencyRoute'));
app.use('/api/chat', require('./routes/chatRoute'));

app.use('/api/users', require('./routes/userRoute'));

app.use('/api/doctors', require('./routes/doctorRoute'))
app.use('/api/patients', require('./routes/patientRoute'))

app.use('/api/notifications', require('./routes/notificationRoute')); // Integrated notification routes
app.use('/api/appointments', require('./routes/appointmentRoute')); // Integrated appointment routes

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io event handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join room: this could be a unique room for each pair of users chatting
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Listen for sendMessage from client
  socket.on('sendMessage', async (data) => {
    // data: { senderId, receiverId, message }

    // Save message to DB (reuse your chat controller logic here)
    try {
      const Chat = require('./models/Chat'); // import here to avoid circular deps
      const chat = new Chat({
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
      });
      await chat.save();

      // Emit message to receiver and sender in the room
      const roomId = getRoomId(data.senderId, data.receiverId);
      io.to(roomId).emit('receiveMessage', chat);
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Helper function to get consistent room ID for two users
function getRoomId(user1, user2) {
  return [user1, user2].sort().join('_'); // ensures order doesn't matter
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
