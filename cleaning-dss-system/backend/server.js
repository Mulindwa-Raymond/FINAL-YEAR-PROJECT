require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/api');

const app = express();


// ==================== CORS Configuration ====================
// Allow multiple origins for production and development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

// Also allow custom CORS_ORIGIN from environment variable
if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(',').forEach(origin => {
    if (!allowedOrigins.includes(origin.trim())) {
      allowedOrigins.push(origin.trim());
    }
  });
}

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      logger.warn(`CORS blocked request from: ${origin}`);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== MongoDB Connection ====================
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // For production: ensure proper SSL validation
  tls: true,
  tlsAllowInvalidCertificates: process.env.NODE_ENV !== 'production',
  tlsAllowInvalidHostnames: process.env.NODE_ENV !== 'production'
};

mongoose.connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => logger.info('MongoDB connected successfully'))
  .catch(err => logger.error('MongoDB connection error:', err));

// ==================== Routes ====================
// API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Clean Match DSS Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Clean Match DSS API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1/*',
      imageProxy: '/api/image-proxy?url=<encoded_url>'
    }
  });
});

// ==================== Global Error Handler ====================
// Error handler (must be last)
app.use(errorHandler);

// ==================== Server Start ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
});