require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');

const testPassword = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected successfully\n');

    // Get admin user
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('🔍 TESTING PASSWORD COMPARISON:\n');
    console.log(`Stored hash: ${adminUser.password}`);
    console.log(`Testing password: "admin123"`);

    // Test password comparison
    const isMatch = await adminUser.comparePassword('admin123');
    console.log(`Password match result: ${isMatch}`);

    // Also test with bcrypt directly
    const directMatch = await bcrypt.compare('admin123', adminUser.password);
    console.log(`Direct bcrypt compare result: ${directMatch}`);

    // Test wrong password
    const wrongMatch = await adminUser.comparePassword('wrongpassword');
    console.log(`Wrong password match result: ${wrongMatch}`);

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testPassword();