// This will query MongoDB to check users
require('dotenv').config();
const mongoose = require('mongoose');

const queryUsers = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected successfully\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Get all users
    console.log('📋 ALL USERS IN DATABASE:\n');
    const allUsers = await usersCollection.find({}).toArray();

    if (allUsers.length === 0) {
      console.log('⚠️ No users found in database!\n');
    } else {
      allUsers.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`  ID: ${user._id}`);
        console.log(`  Username: ${user.username}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Active: ${user.is_active}`);
        console.log(`  Password Hash (first 50 chars): ${user.password.substring(0, 50)}...`);
        console.log(`  Last Login: ${user.last_login || 'Never'}`);
        console.log(`  Created At: ${user.createdAt}`);
        console.log(`  Updated At: ${user.updatedAt}`);
        console.log('');
      });
    }

    // Specifically check admin user
    console.log('🔍 CHECKING ADMIN USER:\n');
    const adminUser = await usersCollection.findOne({ username: 'admin' });
    if (adminUser) {
      console.log('✅ Admin user EXISTS');
      console.log(`  Email: ${adminUser.email}`);
      console.log(`  Active: ${adminUser.is_active}`);
      console.log(`  Password Hash: ${adminUser.password}`);
      console.log(`  Hash Type: ${adminUser.password.startsWith('$2') ? 'bcrypt (valid)' : 'INVALID or not bcrypt'}`);
    } else {
      console.log('❌ Admin user NOT FOUND');
    }

    // Check for potential issues
    console.log('\n🔎 CHECKING FOR DATA ISSUES:\n');
    const issues = [];

    for (const user of allUsers) {
      // Check if password exists
      if (!user.password) {
        issues.push(`❌ User "${user.username}" has no password hash`);
      }
      // Check if password is valid bcrypt
      else if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$') && !user.password.startsWith('$2x$') && !user.password.startsWith('$2y$')) {
        issues.push(`❌ User "${user.username}" has invalid password hash format: ${user.password.substring(0, 30)}...`);
      }
      // Check if user is inactive
      if (!user.is_active) {
        issues.push(`⚠️ User "${user.username}" is INACTIVE`);
      }
      // Check if email is valid
      if (!user.email || !user.email.includes('@')) {
        issues.push(`❌ User "${user.username}" has invalid email: ${user.email}`);
      }
    }

    if (issues.length === 0) {
      console.log('✅ No data issues found!');
    } else {
      issues.forEach(issue => console.log(issue));
    }

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

queryUsers();