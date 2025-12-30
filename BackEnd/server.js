const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const http = require('http'); // Required for socket.io
const { Server } = require('socket.io'); // Import the Server class
const path = require('path');
const jwt = require('jsonwebtoken'); // To verify tokens for socket auth
const connectDB = require('./db.js'); // Corrected path
const { startEconomyEngine } = require('./utils/economyEngine.js');
const { startPerformanceTracker } = require('./utils/performanceTracker.js');
const cors = require('cors'); // Import cors

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app); // Create an HTTP server from the Express app
const io = new Server(server, {
  // Configure CORS for socket.io
  cors: {
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST'],
  },
});

// --- Socket.io Connection Logic ---
const userSockets = {}; // In-memory mapping of userId to socketId

// Make io and userSockets available to routes via req.app.get()
app.set('io', io);
app.set('userSockets', userSockets);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a client authenticates, store their socket ID
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userSockets[decoded.id] = socket.id;
      console.log(`User ${decoded.id} authenticated with socket ${socket.id}`);
    } catch (error) {
      console.log('Socket authentication failed.');
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // Find and remove the user from the mapping on disconnect
    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
  });
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all routes (important for frontend-backend communication during development)
app.use(cors());

// Serve static files from the FrontEnd folder
app.use(express.static(path.join(__dirname, '../FrontEnd')));

// Define a basic test route
app.get('/api', (req, res) => {
  res.send('RiseFaze Backend API is running...');
});

// User Routes
app.use('/api/users', require('./routes/userRoutes.js'));

// Asset Routes
app.use('/api/assets', require('./routes/assetRoutes.js'));

// Leaderboard Routes
app.use('/api/leaderboard', require('./routes/leaderboardRoutes.js'));

// Set up the port
const PORT = process.env.PORT || 5001;

// Start the background job for the economy
startEconomyEngine(io, userSockets); // Pass the io instance and sockets map

// Start the background job for performance tracking
startPerformanceTracker();

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});