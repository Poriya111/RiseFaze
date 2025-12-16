// Load environment variables FIRST
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const connectDB = require('./db.js'); // Corrected path
const cors = require('cors'); // Import cors

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all routes (important for frontend-backend communication during development)
app.use(cors());

// Define a basic test route
app.get('/api', (req, res) => {
  res.send('RiseFaze Backend API is running...');
});

// User Routes
app.use('/api/users', require('./routes/userRoutes.js'));

// Asset Routes
app.use('/api/assets', require('./routes/assetRoutes.js'));

// Set up the port
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});