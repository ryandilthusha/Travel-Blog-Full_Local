// server/index.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config(); // Import environment variables from .env file at the start

// Create an instance of Express application
const app = express();

// Apply middleware
app.use(cors()); // Use CORS to allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Use the authRoutes for any requests that start with '/api/auth'
app.use('/api/auth', authRoutes);

// Serve static files from the 'public' directory (optional, if we want to serve our front-end from the same Express app)
app.use(express.static('public'));

// Start the server on the specified PORT
const PORT = process.env.PORT || 3001; // Fallback to 3001 if PORT is not defined in .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
