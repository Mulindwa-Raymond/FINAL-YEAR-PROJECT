require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');  // Add this require for MongoDB connection
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/api');

const app = express();

// Connect to MongoDB with proper SSL/TLS configuration
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  // For production: ensure proper SSL validation
  // For development issues: temporarily allow invalid certificates
  tls: true,
  tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
  tlsAllowInvalidHostnames: process.env.NODE_ENV === 'development'
};

mongoose.connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Clean Match DSS Backend is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});