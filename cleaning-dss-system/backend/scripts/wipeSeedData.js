/**
 * wipeSeedData.js
 * Deletes ONLY data inserted by seedData.js (Equipment, Detergents, Rules, Training, etc.)
 * Preserves User data (users are seeded separately by seedUsers.js)
 * 
 * Usage: node scripts/wipeSeedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// List of collections created by seedData.js
const SEEDED_COLLECTIONS = [
  'equipment',           // Equipment model
  'detergents',          // Detergent model
  'rules',               // Rule model
  'trainings',           // Training model
  'tcomultipliers',      // TcoMultiplier model
  'localcontexts',       // LocalContext model
  'equipmentspecs',      // EquipmentSpecs model
  'equipmentdetergentcompatibilities', // Compatibility model
  'recommendations',     // Recommendation model
  'workingmemories',     // WorkingMemory model
  'feedback',            // Feedback model
  'systemmetrics',       // SystemMetric model
  'auditlogs'            // AuditLog model (optional - comment if you want to keep)
];

const wipeSeedData = async () => {
  try {
    await connectDB();
    console.log('🔗 Connected to MongoDB\n');
    console.log('🗑️  Deleting data from seedData.js collections...\n');

    const db = mongoose.connection.db;
    let deletedCount = 0;

    for (const collectionName of SEEDED_COLLECTIONS) {
      try {
        const collections = await db.listCollections({ name: collectionName }).toArray();
        if (collections.length > 0) {
          const result = await db.collection(collectionName).deleteMany({});
          console.log(`   ✅ ${collectionName}: ${result.deletedCount} document(s) deleted`);
          deletedCount += result.deletedCount;
        } else {
          console.log(`   ⚠️ ${collectionName}: collection does not exist (skipped)`);
        }
      } catch (err) {
        console.log(`   ❌ ${collectionName}: error - ${err.message}`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📊 TOTAL DELETED: ${deletedCount} documents`);
    console.log('='.repeat(50));
    console.log('\n✅ seedData.js data wiped successfully!');
    console.log('👥 User data remains intact (from seedUsers.js)');
    console.log('\n💡 To re-populate, run: npm run seed\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error wiping data:', error.message);
    process.exit(1);
  }
};

wipeSeedData();