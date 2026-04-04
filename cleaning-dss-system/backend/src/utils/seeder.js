import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Equipment from '../models/Equipment.js';
import Detergent from '../models/Detergent.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Equipment.deleteMany();
    await Detergent.deleteMany();

    const machines = [
      {
        name: 'SuperScrub 2000',
        brand: 'CleanCo',
        type: 'Scrubber',
        specifications: {
          powerSource: 'Battery',
          weight: 45,
          noiseLevel: 65,
          tankCapacity: 20,
        },
        tcoData: {
          purchasePrice: 2500000,
          lifespanYears: 5,
          annualMaintenance: 200000,
        },
        compatibility: {
          surfaces: ['Tile', 'Vinyl', 'Marble'],
          soilTypes: ['Dust', 'Food Stains'],
        },
      },
      {
        name: 'HeavyDuty Industrial',
        brand: 'PowerClean',
        type: 'Scrubber',
        specifications: {
          powerSource: 'Mains',
          weight: 80,
          noiseLevel: 75,
          tankCapacity: 50,
        },
        tcoData: {
          purchasePrice: 4500000,
          lifespanYears: 7,
          annualMaintenance: 400000,
        },
        compatibility: {
          surfaces: ['Concrete', 'Tile'],
          soilTypes: ['Grease', 'Oil', 'Red Laterite Soil'],
        },
      }
    ];

    const detergents = [
      {
        name: 'EcoClean Multi',
        brand: 'GreenWay',
        phLevel: 7,
        dilutionRatio: '1:50',
        ecoFriendly: true,
        compatibility: {
          surfaces: ['Tile', 'Vinyl', 'Marble', 'Hardwood'],
          soilTypes: ['Dust', 'Food Stains'],
          machineTypes: ['Scrubber', 'All'],
        },
        price: 15000,
      },
      {
        name: 'Degreaser Pro',
        brand: 'IndustrialPlus',
        phLevel: 12,
        dilutionRatio: '1:20',
        ecoFriendly: false,
        compatibility: {
          surfaces: ['Concrete', 'Tile'],
          soilTypes: ['Grease', 'Oil'],
          machineTypes: ['Scrubber'],
        },
        price: 25000,
      }
    ];

    await Equipment.insertMany(machines);
    await Detergent.insertMany(detergents);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
