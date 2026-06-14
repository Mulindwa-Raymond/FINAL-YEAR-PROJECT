/**
 * marketDataService.js
 * Fetches and manages Ugandan cleaning industry market data
 */

// Static market data (can be updated from API later)
export const marketData = {
  // Cleaning Industry Statistics Uganda
  industryStats: {
    marketSize: "$47.2M",
    marketSizeValue: 47200000,
    growthRate: "8.5%",
    growthRateValue: 8.5,
    activeCompanies: "1,280+",
    activeCompaniesValue: 1280,
    annualGrowth: "12.3%",
    annualGrowthValue: 12.3,
    employmentRate: "15,000+",
    employmentRateValue: 15000,
    equipmentImports: "$12.5M",
    equipmentImportsValue: 12500000,
    chemicalImports: "$8.2M",
    chemicalImportsValue: 8200000,
  },
  
  // Power Stability Data by Region
  powerStability: {
    kampala: { stable: 65, unstable: 35, avgHours: 18 },
    industrial: { stable: 45, unstable: 55, avgHours: 12 },
    upcountry: { stable: 30, unstable: 70, avgHours: 8 },
  },
  
  // Common Soil Types in Uganda
  soilTypes: [
    { name: "Red Laterite Soil", prevalence: "High", regions: "Central, Eastern" },
    { name: "Black Cotton Soil", prevalence: "Medium", regions: "Northern" },
    { name: "Sandy Loam", prevalence: "Low", regions: "Western" },
  ],
  
  // Budget Distribution
  budgetRanges: {
    small: { min: 0, max: 2000000, percentage: 35, label: "Small (0-2M UGX)" },
    medium: { min: 2000000, max: 5000000, percentage: 45, label: "Medium (2-5M UGX)" },
    large: { min: 5000000, max: 10000000, percentage: 15, label: "Large (5-10M UGX)" },
    enterprise: { min: 10000000, max: 25000000, percentage: 5, label: "Enterprise (10M+ UGX)" },
  },
  
  // Cleaning Challenges
  challenges: {
    powerOutages: "6-8 hours daily",
    importLeadTime: "45-60 days",
    sparePartsAvail: "65%",
    trainedStaff: "42%",
    chemicalCompliance: "58%",
  },
  
  // Local Suppliers
  suppliers: [
    { name: "Power Products Uganda", location: "Kampala", specialties: ["Kärcher", "Cleaning Equipment"] },
    { name: "Kensons Hardware", location: "Kampala", specialties: ["Cleaning Chemicals", "Equipment"] },
    { name: "Jumbo Hardware", location: "Kampala", specialties: ["Detergents", "Accessories"] },
    { name: "Game Stores", location: "Kampala, Nansana", specialties: ["Domestic Equipment"] },
  ],
};

// Market trends data for charts
export const marketTrends = {
  equipmentImports: [
    { year: 2021, value: 8.2, category: "Equipment" },
    { year: 2022, value: 9.8, category: "Equipment" },
    { year: 2023, value: 11.2, category: "Equipment" },
    { year: 2024, value: 12.5, category: "Equipment" },
  ],
  detergentDemand: [
    { year: 2021, value: 5.1, category: "Detergents" },
    { year: 2022, value: 6.2, category: "Detergents" },
    { year: 2023, value: 7.4, category: "Detergents" },
    { year: 2024, value: 8.9, category: "Detergents" },
  ],
};

// Data source links
export const dataSources = {
  ubos: "https://www.ubos.org/",
  ministryOfTrade: "https://mtic.go.ug/",
  uma: "https://www.ugandamanufacturers.org/",
  bankOfUganda: "https://www.bou.or.ug/",
  nema: "https://www.nema.go.ug/",
};