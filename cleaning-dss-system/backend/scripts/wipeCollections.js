/**
 * wipeCollections.js
 * Wipe specific collections
 * Usage: node scripts/wipeCollections.js equipment detergents rules
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Get collection names from command line arguments
const collectionsToWipe = process.argv.slice(2);

if (collectionsToWipe.length === 0) {
  console.log('❌ Please specify collections to wipe:');
  console.log('   node scripts/wipeCollections.js equipment detergents rules');
  console.log('\n📋 Available collections:');
  console.log('   - equipment');
  console.log('   - detergents');
  console.log('   - rules');
  console.log('   - users');
  console.log('   - trainings');
  console.log('   - recommendations');
  console.log('   - feedback');
  console.log('   - auditlogs');
  process.exit(1);
}

const wipeCollections = async () => {
  try {
    await connectDB();
    console.log('🔗 Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    let deletedCount = 0;
    
    for (const collectionName of collectionsToWipe) {
      try {
        const collections = await db.listCollections({ name: collectionName }).toArray();
        if (collections.length > 0) {
          const result = await db.collection(collectionName).deleteMany({});
          console.log(`   ✅ ${collectionName}: ${result.deletedCount} document(s) deleted`);
          deletedCount += result.deletedCount;
        } else {
          console.log(`   ⚠️ ${collectionName}: collection does not exist`);
        }
      } catch (err) {
        console.log(`   ❌ ${collectionName}: error - ${err.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 TOTAL DELETED: ${deletedCount} documents`);
    console.log('='.repeat(50));
    console.log('\n✅ Specified collections wiped successfully!\n');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error wiping collections:', error.message);
    process.exit(1);
  }
};

wipeCollections();