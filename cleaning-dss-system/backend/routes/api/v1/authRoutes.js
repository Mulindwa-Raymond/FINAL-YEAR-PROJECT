const express = require('express');
const {
  register,
  login,
  getMe,
  changePassword
} = require('../../../controllers/authController');
const { auth } = require('../../../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);
router.put('/change-password', auth, changePassword);

module.exports = router;