// backend/__tests__/helpers/authHelper.js
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const createTestUser = async (role = 'standard') => {
  const user = new User({
    username: `testuser_${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password_hash: 'TestPass123!',
    role
  });
  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { user, token };
};

module.exports = { createTestUser };