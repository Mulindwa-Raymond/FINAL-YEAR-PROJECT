require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const roles = require('./config/roles');

const fixAdminUser = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected successfully\n');

    // Delete existing admin user
    console.log('🗑️ Deleting existing admin user...');
    const deleteResult = await User.deleteOne({ username: 'admin' });
    console.log(`Deleted ${deleteResult.deletedCount} admin user(s)`);

    // Create new admin user with correct password
    console.log('👤 Creating new admin user...');
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      username: 'admin',
      email: 'admin@cleanmatch.com',
      password: hashedPassword,
      role: roles.ADMIN,
      is_active: true,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log(`   Username: admin`);
    console.log(`   Email: admin@cleanmatch.com`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: ${roles.ADMIN}`);

    // Verify the password works
    console.log('\n🔍 Verifying password...');
    const isMatch = await adminUser.comparePassword(adminPassword);
    console.log(`Password verification: ${isMatch ? '✅ SUCCESS' : '❌ FAILED'}`);

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixAdminUser();