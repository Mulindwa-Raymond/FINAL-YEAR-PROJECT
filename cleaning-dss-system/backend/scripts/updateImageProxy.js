/**
 * updateImageProxy.js
 * Updates existing equipment and detergent image URLs to use the proxy.
 * Run this after deploying the image proxy route.
 * 
 * Usage: node scripts/updateImageProxy.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { Equipment } = require('../models/Equipment');
const { Detergent } = require('../models/Detergent');

const updateImageUrls = async () => {
  try {
    await connectDB();
    console.log('🔗 Connected to MongoDB\n');

    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    let totalUpdated = 0;

    // ============================================
    // Update Equipment Images
    // ============================================
    console.log('📦 Updating Equipment images...');
    const equipment = await Equipment.find({});
    let equipmentUpdated = 0;

    for (const item of equipment) {
      if (item.image_url && item.image_url.trim() !== '') {
        // Check if URL already uses the proxy
        if (!item.image_url.startsWith('/api/image-proxy') && !item.image_url.startsWith(`${apiBaseUrl}/api/image-proxy`)) {
          const proxyUrl = `${apiBaseUrl}/api/image-proxy?url=${encodeURIComponent(item.image_url)}`;
          await Equipment.updateOne(
            { _id: item._id },
            { $set: { image_url: proxyUrl } }
          );
          equipmentUpdated++;
          console.log(`   ✅ Updated equipment: ${item.brand_name} ${item.model_name}`);
        }
      }
    }
    totalUpdated += equipmentUpdated;
    console.log(`   📊 Equipment updated: ${equipmentUpdated}\n`);

    // ============================================
    // Update Detergent Images
    // ============================================
    console.log('🧪 Updating Detergent images...');
    const detergents = await Detergent.find({});
    let detergentUpdated = 0;

    for (const item of detergents) {
      if (item.image_url && item.image_url.trim() !== '') {
        // Check if URL already uses the proxy
        if (!item.image_url.startsWith('/api/image-proxy') && !item.image_url.startsWith(`${apiBaseUrl}/api/image-proxy`)) {
          const proxyUrl = `${apiBaseUrl}/api/image-proxy?url=${encodeURIComponent(item.image_url)}`;
          await Detergent.updateOne(
            { _id: item._id },
            { $set: { image_url: proxyUrl } }
          );
          detergentUpdated++;
          console.log(`   ✅ Updated detergent: ${item.product_name}`);
        }
      }
    }
    totalUpdated += detergentUpdated;
    console.log(`   📊 Detergents updated: ${detergentUpdated}\n`);

    // ============================================
    // Summary
    // ============================================
    console.log('='.repeat(50));
    console.log(`📊 TOTAL UPDATED: ${totalUpdated} items`);
    console.log('='.repeat(50));
    console.log('\n✅ Image URLs updated successfully!');
    console.log(`   Equipment: ${equipmentUpdated}`);
    console.log(`   Detergents: ${detergentUpdated}`);
    console.log(`\n💡 Images will now be served via the proxy: ${apiBaseUrl}/api/image-proxy\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    process.exit(1);
  }
};

updateImageUrls();