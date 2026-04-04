import Equipment from '../models/Equipment.js';
import Detergent from '../models/Detergent.js';

const MOCK_MACHINES = [
  {
    name: 'SuperScrub 2000',
    brand: 'CleanCo',
    type: 'Scrubber',
    category: 'Scrubber',
    specifications: {
      powerSource: 'Battery',
      weight: 45,
      noiseLevel: 65,
      tankCapacity: 20,
      areaPerformance: 800,
    },
    tcoData: {
      purchasePrice: 2500000,
      lifespanYears: 5,
      annualMaintenance: 200000,
      annualEnergyCost: 150000,
      annualSpareParts: 80000,
    },
    compatibility: {
      surfaces: ['Tile', 'Vinyl', 'Marble'],
      soilTypes: ['Dust', 'Food Stains'],
      premisesTypes: ['Office', 'Hotel', 'School', 'Hospital'],
    },
    sparePartsLocal: true,
  },
  {
    name: 'HeavyDuty Industrial',
    brand: 'PowerClean',
    type: 'Scrubber',
    category: 'Scrubber',
    specifications: {
      powerSource: 'Mains',
      weight: 80,
      noiseLevel: 78,
      tankCapacity: 50,
      areaPerformance: 1500,
    },
    tcoData: {
      purchasePrice: 4500000,
      lifespanYears: 7,
      annualMaintenance: 400000,
      annualEnergyCost: 350000,
      annualSpareParts: 150000,
    },
    compatibility: {
      surfaces: ['Concrete', 'Tile'],
      soilTypes: ['Grease', 'Oil', 'Red Laterite'],
      premisesTypes: ['Warehouse', 'Industrial', 'Restaurant'],
    },
    sparePartsLocal: false,
  },
  {
    name: 'EcoVacuum Pro',
    brand: 'GreenTech',
    type: 'Vacuum',
    category: 'Vacuum',
    specifications: {
      powerSource: 'Battery',
      weight: 12,
      noiseLevel: 55,
      tankCapacity: 10,
      areaPerformance: 600,
    },
    tcoData: {
      purchasePrice: 1800000,
      lifespanYears: 4,
      annualMaintenance: 120000,
      annualEnergyCost: 80000,
      annualSpareParts: 50000,
    },
    compatibility: {
      surfaces: ['Tile', 'Vinyl', 'Hardwood', 'Marble'],
      soilTypes: ['Dust', 'Food Stains'],
      premisesTypes: ['Office', 'Hotel', 'School', 'Hospital'],
    },
    sparePartsLocal: true,
  },
  {
    name: 'RedSoil Defender',
    brand: 'AfriClean',
    type: 'Scrubber',
    category: 'Scrubber',
    specifications: {
      powerSource: 'Battery',
      weight: 55,
      noiseLevel: 68,
      tankCapacity: 30,
      areaPerformance: 1000,
    },
    tcoData: {
      purchasePrice: 3200000,
      lifespanYears: 6,
      annualMaintenance: 280000,
      annualEnergyCost: 180000,
      annualSpareParts: 100000,
    },
    compatibility: {
      surfaces: ['Concrete', 'Tile', 'Vinyl'],
      soilTypes: ['Red Laterite', 'Dust', 'Grease'],
      premisesTypes: ['Warehouse', 'Industrial', 'Hotel', 'Office'],
    },
    sparePartsLocal: true,
  },
  {
    name: 'HygieClean Pro',
    brand: 'HygieneTech',
    type: 'Scrubber',
    category: 'Scrubber',
    specifications: {
      powerSource: 'Mains',
      weight: 60,
      noiseLevel: 70,
      tankCapacity: 40,
      areaPerformance: 1200,
    },
    tcoData: {
      purchasePrice: 3800000,
      lifespanYears: 6,
      annualMaintenance: 320000,
      annualEnergyCost: 280000,
      annualSpareParts: 120000,
    },
    compatibility: {
      surfaces: ['Tile', 'Vinyl', 'Concrete'],
      soilTypes: ['Food Stains', 'Grease', 'Dust'],
      premisesTypes: ['Hospital', 'Restaurant', 'Hotel', 'School'],
    },
    sparePartsLocal: false,
  },
];

const MOCK_DETERGENTS = [
  {
    name: 'EcoClean Multi',
    brand: 'GreenWay',
    phLevel: 7,
    dilutionRatio: '1:50',
    ecoFriendly: true,
    foamLevel: 'Medium',
    compatibility: {
      surfaces: ['Tile', 'Vinyl', 'Marble', 'Hardwood'],
      soilTypes: ['Dust', 'Food Stains'],
      machineTypes: ['Scrubber', 'Vacuum', 'All'],
    },
    price: 15000,
  },
  {
    name: 'Degreaser Pro',
    brand: 'IndustrialPlus',
    phLevel: 12,
    dilutionRatio: '1:20',
    ecoFriendly: false,
    foamLevel: 'Low',
    compatibility: {
      surfaces: ['Concrete', 'Tile'],
      soilTypes: ['Grease', 'Oil'],
      machineTypes: ['Scrubber'],
    },
    price: 25000,
  },
  {
    name: 'LateriteBuster',
    brand: 'AfriChem',
    phLevel: 10,
    dilutionRatio: '1:30',
    ecoFriendly: false,
    foamLevel: 'High',
    compatibility: {
      surfaces: ['Concrete', 'Tile', 'Vinyl'],
      soilTypes: ['Red Laterite', 'Dust', 'Grease'],
      machineTypes: ['Scrubber'],
    },
    price: 20000,
  },
  {
    name: 'GentleClean',
    brand: 'SafeWash',
    phLevel: 7,
    dilutionRatio: '1:80',
    ecoFriendly: true,
    foamLevel: 'Low',
    compatibility: {
      surfaces: ['Marble', 'Hardwood', 'Vinyl'],
      soilTypes: ['Dust', 'Food Stains'],
      machineTypes: ['Scrubber', 'Vacuum', 'All'],
    },
    price: 18000,
  },
  {
    name: 'FoodSafe Pro',
    brand: 'HygienePlus',
    phLevel: 8,
    dilutionRatio: '1:40',
    ecoFriendly: true,
    foamLevel: 'Medium',
    compatibility: {
      surfaces: ['Tile', 'Vinyl', 'Concrete'],
      soilTypes: ['Food Stains', 'Grease', 'Dust'],
      machineTypes: ['Scrubber', 'All'],
    },
    price: 22000,
  },
];

const generateProsAndCons = (machine, formData) => {
  const pros = [];
  const cons = [];

  if (machine.specifications.powerSource === 'Battery' && formData.powerAvailability !== 'Stable mains power') {
    pros.push('Ideal for areas with unreliable or no grid electricity');
  }
  if (machine.specifications.powerSource === 'Battery') {
    pros.push('No cable — flexible placement anywhere in your facility');
  }
  if (machine.tcoData.purchasePrice <= formData.budgetRange) {
    pros.push('Purchase price fits within your stated budget');
  }
  if (machine.specifications.noiseLevel < 65) {
    pros.push('Quiet operation — suitable for offices, hospitals, and schools');
  }
  if (machine.sparePartsLocal) {
    pros.push('Spare parts available locally in Uganda — minimal downtime');
  }
  if (machine.compatibility.soilTypes.includes('Red Laterite') && formData.soilTypes?.includes('Red Laterite')) {
    pros.push('Built to handle abrasive red laterite soil effectively');
  }
  if (machine.specifications.areaPerformance >= 1000) {
    pros.push(`High coverage rate — cleans up to ${machine.specifications.areaPerformance} m²/hr`);
  }

  if (machine.tcoData.purchasePrice > formData.budgetRange) {
    const over = machine.tcoData.purchasePrice - formData.budgetRange;
    cons.push(`Exceeds your budget by UGX ${over.toLocaleString()}`);
  }
  if (machine.specifications.powerSource === 'Mains' && formData.powerAvailability === 'Frequent outages') {
    cons.push('Requires stable mains power — high risk during power outages');
  }
  if (machine.specifications.noiseLevel > 72) {
    cons.push(`Noise level ${machine.specifications.noiseLevel} dB — not suitable for noise-sensitive areas`);
  }
  if (!machine.sparePartsLocal) {
    cons.push('Spare parts must be imported — longer wait times and higher repair costs');
  }
  if (machine.specifications.powerSource === 'Mains') {
    cons.push('Higher energy running costs due to mains power dependency');
  }

  return { pros: pros.slice(0, 4), cons: cons.slice(0, 3) };
};

const generateReasoning = (machine, formData) => {
  const parts = [];
  if (formData.premisesType) parts.push(`suited for ${formData.premisesType} environments`);
  if (formData.surfaceType) parts.push(`matched for ${formData.surfaceType} flooring`);
  if (formData.soilTypes?.length > 0) parts.push(`handles ${formData.soilTypes.join(' and ')} soil`);
  if (machine.specifications.powerSource === 'Battery' && formData.powerAvailability !== 'Stable mains power') {
    parts.push('runs on battery to work through power outages');
  }
  if (machine.sparePartsLocal) parts.push('spare parts are stocked locally in Uganda');
  return parts.length > 0 ? parts.join(', ') + '.' : `Recommended based on your site profile.`;
};

export const getRecommendations = async (req, res) => {
  try {
    const {
      premisesType,
      surfaceType,
      soilTypes,
      areaSize,
      budgetRange,
      powerAvailability,
      noiseSensitivity,
      ecoFriendly,
      machineCategory,
      powerType,
      phPreference,
      foamPreference,
    } = req.body;

    let machines = [];
    let detergents = [];

    try {
      machines = await Equipment.find({});
      detergents = await Detergent.find({});
      if (machines.length === 0) machines = MOCK_MACHINES;
      if (detergents.length === 0) detergents = MOCK_DETERGENTS;
    } catch {
      machines = MOCK_MACHINES;
      detergents = MOCK_DETERGENTS;
    }

    let filteredMachines = machines.filter((machine) => {
      if (surfaceType && !machine.compatibility.surfaces.includes(surfaceType)) return false;
      if (soilTypes && soilTypes.length > 0) {
        const hasSoil = soilTypes.some((soil) => machine.compatibility.soilTypes.includes(soil));
        if (!hasSoil) return false;
      }
      if (noiseSensitivity && machine.specifications.noiseLevel > 70) return false;
      if (machineCategory && machineCategory.length > 0) {
        if (!machineCategory.includes(machine.category || machine.type)) return false;
      }
      if (powerType && powerType.length > 0) {
        if (!powerType.includes(machine.specifications.powerSource)) return false;
      }
      return true;
    });

    if (filteredMachines.length === 0) filteredMachines = machines;

    let filteredDetergents = detergents.filter((d) => {
      if (surfaceType && !d.compatibility.surfaces.includes(surfaceType)) return false;
      if (ecoFriendly && !d.ecoFriendly) return false;
      if (phPreference === 'Low' && d.phLevel > 7) return false;
      if (phPreference === 'High' && d.phLevel < 8) return false;
      if (foamPreference === 'Low' && d.foamLevel === 'High') return false;
      if (foamPreference === 'High' && d.foamLevel === 'Low') return false;
      return true;
    });

    const recommendations = filteredMachines.map((machine) => {
      const compatibleDetergents = filteredDetergents.filter((d) => {
        const machineMatch =
          d.compatibility.machineTypes.includes(machine.type) ||
          d.compatibility.machineTypes.includes('All');
        let chemicalSafe = true;
        if (surfaceType === 'Marble' || surfaceType === 'Stone') {
          if (d.phLevel < 6) chemicalSafe = false;
        }
        if (surfaceType === 'Hardwood') {
          if (d.phLevel > 9) chemicalSafe = false;
        }
        return machineMatch && chemicalSafe;
      });

      const powerMultiplier = machine.specifications.powerSource === 'Mains' ? 1.2 : 1.0;
      const soilMultiplier = soilTypes && soilTypes.includes('Red Laterite') ? 1.15 : 1.0;
      const areaSizeMultiplier = areaSize && areaSize > 2000 ? 1.1 : 1.0;

      const baseYearlyTCO =
        machine.tcoData.purchasePrice / machine.tcoData.lifespanYears +
        (machine.tcoData.annualMaintenance || 0) +
        (machine.tcoData.annualEnergyCost || 0) +
        (machine.tcoData.annualSpareParts || 0);

      const localizedYearlyTCO = baseYearlyTCO * powerMultiplier * soilMultiplier * areaSizeMultiplier;
      const fiveYearTCO = localizedYearlyTCO * 5;

      let matchScore = 100;
      if (budgetRange && machine.tcoData.purchasePrice > budgetRange) {
        matchScore -= Math.min(40, (machine.tcoData.purchasePrice - budgetRange) / 100000);
      }
      if (soilTypes && soilTypes.includes('Red Laterite') && !machine.compatibility.soilTypes.includes('Red Laterite')) {
        matchScore -= 30;
      }
      if (machine.specifications.powerSource === 'Mains' && powerAvailability === 'Frequent outages') {
        matchScore -= 20;
      }
      if (!machine.sparePartsLocal) {
        matchScore -= 10;
      }
      if (premisesType && machine.compatibility.premisesTypes && machine.compatibility.premisesTypes.includes(premisesType)) {
        matchScore += 5;
      }
      matchScore = Math.max(0, Math.min(100, matchScore));

      const { pros, cons } = generateProsAndCons(machine, req.body);
      const reasoning = generateReasoning(machine, req.body);

      return {
        machine,
        detergents: compatibleDetergents,
        tcoScore: localizedYearlyTCO,
        fiveYearTCO,
        matchScore: Math.round(matchScore),
        reasoning,
        pros,
        cons,
      };
    });

    recommendations.sort((a, b) => b.matchScore - a.matchScore || a.tcoScore - b.tcoScore);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
