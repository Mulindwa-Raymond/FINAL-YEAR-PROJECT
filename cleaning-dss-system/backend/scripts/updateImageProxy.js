require('dotenv').config();
const mongoose = require('mongoose');
const { Equipment } = require('../models/Equipment');
const connectDB = require('../config/db');

const updateImageUrls = async () => {
  try {
    await connectDB();
    console.log('🔗 Connected to MongoDB\n');

    const equipment = await Equipment.find({});
    console.log(`📋 Found ${equipment.length} equipment items\n`);

    let updated = 0;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5000';

    for (const item of equipment) {
      if (item.image_url && item.image_url.trim() !== '') {
        // Transform the URL to use our proxy
        const proxyUrl = `${apiBaseUrl}/api/image-proxy?url=${encodeURIComponent(item.image_url)}`;
        
        await Equipment.updateOne(
          { _id: item._id },
          { $set: { image_url: proxyUrl } }
        );
        updated++;
        console.log(`   ✅ Updated ${item.brand_name} ${item.model_name}`);
      }
    }
    
    console.log(`\n✅ Updated ${updated} equipment images to use proxy`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Update failed:', error.message);
  }
};

updateImageUrls();