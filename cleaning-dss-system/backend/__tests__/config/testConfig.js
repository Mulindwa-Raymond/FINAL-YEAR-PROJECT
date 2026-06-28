// backend/__tests__/config/testConfig.js
const isProduction = process.env.TEST_ENV === 'production';

const config = {
  baseURL: isProduction 
    ? 'https://clean-match-backend.onrender.com/api/v1' 
    : 'http://localhost:5000/api/v1',
  
  isProduction,
  
  // Optional: Add headers for hosted environment
  headers: isProduction ? {
    'User-Agent': 'Jest-Test-Suite'
  } : {}
};

module.exports = config;