// backend/utils/seedCompatibility.js
/**
 * Seed script: populate EquipmentDetergentCompatibility based on actual data.
 * Uses Mongoose models to fetch equipment and detergents, then computes compatibility.
 * Idempotent: clears existing compatibilities before inserting.
 *
 * Run: node utils/seedCompatibility.js (after setting up env)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { Equipment } = require('../models/Equipment');
const { Detergent } = require('../models/Detergent');
const Compatibility = require('../models/EquipmentDetergentCompatibilty');

// Helper: check if two arrays intersect (non‑empty)
function intersects(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length === 0 || arr2.length === 0) return false;
    return arr1.some(item => arr2.includes(item));
}

// Helper: get intersection as string
function getIntersection(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return '';
    return arr1.filter(item => arr2.includes(item)).join(', ');
}

async function seedCompatibility() {
    try {
        await connectDB();
        console.log('🔗 Connected to MongoDB');

        // Clear existing compatibility records
        const deleteResult = await Compatibility.deleteMany({});
        console.log(`🗑️  Removed ${deleteResult.deletedCount} existing compatibility records`);

        // Fetch all active equipment and detergents
        const equipmentList = await Equipment.find({ active: true });
        const detergentList = await Detergent.find({ active: true });

        console.log(`📦 Found ${equipmentList.length} equipment items and ${detergentList.length} detergents`);

        let created = 0;
        let skipped = 0;

        // Loop over each equipment
        for (const eq of equipmentList) {
            for (const det of detergentList) {
                // ---- Domain compatibility ----
                // Map equipment domain to detergent domain:
                // Equipment: 'commercial' -> Detergent: 'industrial' (treat commercial as industrial)
                // Equipment: 'domestic' -> Detergent: 'domestic'
                // Equipment: 'industrial' -> Detergent: 'industrial'
                const equipmentDomain = eq.domain === 'commercial' ? 'industrial' : eq.domain;
                if (det.domain !== 'both' && det.domain !== equipmentDomain) {
                    skipped++;
                    continue;
                }

                // ---- Intensity compatibility ----
                // We'll allow any intensity, but we can store it as a note later.
                // (Optional: require detergent.intensity >= eq.intensity? We'll skip that for now.)

                // ---- Surface compatibility ----
                const surfaceMatch = intersects(eq.surface_compatibility, det.surface_compatibility);

                // ---- Dirt compatibility ----
                const dirtMatch = intersects(eq.dirt_compatibility, det.dirt_compatibility);

                // ---- Decide if compatible ----
                // We require at least one match (surface or dirt) to create a record.
                if (!surfaceMatch && !dirtMatch) {
                    skipped++;
                    continue;
                }

                // Determine is_recommended: true if both surface and dirt match
                const isRecommended = surfaceMatch && dirtMatch;

                // Build notes
                const notes = [];
                if (surfaceMatch) {
                    notes.push(`Surfaces: ${getIntersection(eq.surface_compatibility, det.surface_compatibility)}`);
                }
                if (dirtMatch) {
                    notes.push(`Dirt: ${getIntersection(eq.dirt_compatibility, det.dirt_compatibility)}`);
                }
                if (!surfaceMatch) notes.push('No surface compatibility');
                if (!dirtMatch) notes.push('No dirt compatibility');

                const compatibilityNotes = notes.join('; ');

                // Create record
                const compat = new Compatibility({
                    equipment_id: eq._id,
                    detergent_id: det._id,
                    is_recommended: isRecommended,
                    compatibility_notes: compatibilityNotes,
                });

                await compat.save();
                created++;
            }
        }

        console.log(`✅ Created ${created} compatibility records`);
        console.log(`⏭️  Skipped ${skipped} combinations (no compatibility)`);

        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        await mongoose.disconnect().catch(() => { });
        process.exit(1);
    }
}

seedCompatibility();