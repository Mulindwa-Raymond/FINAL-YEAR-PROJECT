const mongoose = require('mongoose');
const dns = require('dns');
const logger = require('./logger');

const connectDB = async () => {
  try {
    // Some environments block Node's default SRV DNS queries (c-ares).
    // As a pragmatic fallback for development, force Node to use public DNS servers.
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
      logger.info(`Using DNS servers: ${dns.getServers().join(', ')}`);
    } catch (err) {
      // non-fatal; continue and let mongoose try to resolve
      logger.warn('Could not set DNS servers, continuing with system defaults');
    }

    const mongooseOptions = {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      tls: true,
      tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
      tlsAllowInvalidHostnames: process.env.NODE_ENV === 'development'
    };

    await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;