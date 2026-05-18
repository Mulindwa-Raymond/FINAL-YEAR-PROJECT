/**
 * seedUsers.js
 * 
 * Seeds the database with:
 * - Super Admin account (full system access)
 * - Admin account (content management)
 * - Standard user accounts (regular users)
 * 
 * Passwords are hashed using bcrypt.
 * 
 * Usage: node utils/seedUsers.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/User');
const { roles } = require('../config/roles');

const users = [
  // Super Admin - Full system access (can create/edit other admins)
  {
    username: 'super_admin',
    email: 'superadmin@cleanmatch.com',
    password: 'super123',
    role: roles.SUPER_ADMIN,
    organization: 'Clean Match Systems',
  },
  // Admin - Content management only (cannot create/edit other admins)
  {
    username: 'admin_user',
    email: 'admin@cleanmatch.com',
    password: 'admin123',
    role: roles.ADMIN,
    organization: 'Clean Match Systems',
  },
  // Standard Users
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'user123',
    role: roles.STANDARD,
    organization: 'Kweeeza Cleaning Services',
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'user123',
    role: roles.STANDARD,
    organization: 'Freshly Kleen',
  },
  {
    username: 'robert_m',
    email: 'robert@cjay.com',
    password: 'user123',
    role: roles.STANDARD,
    organization: 'C-JAY Home Solutions',
  },
];

const seedUsers = async () => {
  try {
    await connectDB();
    console.log('🔍 Checking existing users...');
    console.log('');

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of users) {
      // Check if user already exists by email or username
      const existing = await User.findOne({
        $or: [{ username: userData.username }, { email: userData.email }],
      });
      
      if (existing) {
        console.log(`⚠️ User ${userData.username} (${userData.role}) already exists. Skipping.`);
        skippedCount++;
        continue;
      }

      // Create new user (let the model's pre-save hook hash the password)
      const user = new User({
        username: userData.username,
        email: userData.email,
        password_hash: userData.password,
        role: userData.role,
        organization: userData.organization || null,
      });
      
      await user.save();
      console.log(`✅ Created user: ${userData.username} (${userData.role})`);
      createdCount++;
    }

    console.log('');
    console.log(`📊 Summary: ${createdCount} created, ${skippedCount} skipped`);
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('   🔑 Super Admin: superadmin@cleanmatch.com / super123');
    console.log('   🔑 Admin: admin@cleanmatch.com / admin123');
    console.log('   🔑 Standard User: john@example.com / user123');
    console.log('');
    console.log('🎉 User seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedUsers();