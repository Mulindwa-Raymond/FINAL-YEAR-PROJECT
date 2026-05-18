/**
 * CSV Parser Utility
 * Reads CSV files and returns array of objects.
 * Uses the 'csv-parser' package.
 */

const fs = require('fs');
const csv = require('csv-parser');

/**
 * Parse a CSV file and return array of objects.
 * @param {string} filePath - Path to the CSV file
 * @param {Object} options - Optional: { delimiter, headers, skipLines }
 * @returns {Promise<Array>} Array of parsed rows
 */
const parseCSV = (filePath, options = {}) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const parserOptions = {
      separator: options.delimiter || ',',
      headers: options.headers || true,
      skipLines: options.skipLines || 0
    };
    
    fs.createReadStream(filePath)
      .pipe(csv(parserOptions))
      .on('data', (data) => {
        // Trim whitespace from keys and values
        const cleaned = {};
        for (const [key, value] of Object.entries(data)) {
          cleaned[key.trim()] = typeof value === 'string' ? value.trim() : value;
        }
        results.push(cleaned);
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

/**
 * Parse CSV and validate against a schema.
 * @param {string} filePath - Path to CSV file
 * @param {Object} schema - Validation schema (optional, for future use)
 * @returns {Promise<Array>} Validated rows
 */
const parseAndValidateCSV = async (filePath, schema = null) => {
  const data = await parseCSV(filePath);
  if (schema) {
    // Basic validation: check that required fields exist
    const requiredFields = schema.required || [];
    for (const row of data) {
      for (const field of requiredFields) {
        if (!row[field]) {
          throw new Error(`Missing required field '${field}' in row: ${JSON.stringify(row)}`);
        }
      }
    }
  }
  return data;
};

/**
 * Convert CSV file to equipment array (specialized helper).
 * @param {string} filePath - Path to CSV
 * @returns {Promise<Array>} Equipment objects
 */
const csvToEquipment = async (filePath) => {
  const rows = await parseCSV(filePath);
  return rows.map(row => ({
    name: row.name,
    brand: row.brand,
    category: row.category,
    intensity: row.intensity,
    domain: row.domain,
    price_ugx: parseFloat(row.price_ugx),
    spare_part_lead_time_days: parseInt(row.spare_part_lead_time_days) || 14,
    power_req: { kW: parseFloat(row.power_kw), type: row.power_type },
    motor_type: row.motor_type,
    noise_level_db: parseInt(row.noise_level_db),
    compatible_surfaces: row.compatible_surfaces ? row.compatible_surfaces.split(',') : [],
    compatible_dirt_types: row.compatible_dirt_types ? row.compatible_dirt_types.split(',') : [],
    materials: row.materials ? row.materials.split(',') : [],
    in_stock: row.in_stock === 'true',
    active: true
  }));
};

/**
 * Convert CSV file to detergent array.
 * @param {string} filePath - Path to CSV
 * @returns {Promise<Array>} Detergent objects
 */
const csvToDetergent = async (filePath) => {
  const rows = await parseCSV(filePath);
  return rows.map(row => ({
    name: row.name,
    brand: row.brand,
    category: row.category,
    intensity: row.intensity,
    domain: row.domain,
    ph: parseFloat(row.ph),
    dilution_ratio: row.dilution_ratio,
    compatible_surfaces: row.compatible_surfaces ? row.compatible_surfaces.split(',') : [],
    incompatible_surfaces: row.incompatible_surfaces ? row.incompatible_surfaces.split(',') : [],
    compatible_dirt_types: row.compatible_dirt_types ? row.compatible_dirt_types.split(',') : [],
    eco_certified: row.eco_certified === 'true',
    price_ugx: parseFloat(row.price_ugx),
    package_size_liters: parseFloat(row.package_size_liters),
    in_stock: row.in_stock === 'true',
    active: true
  }));
};

module.exports = {
  parseCSV,
  parseAndValidateCSV,
  csvToEquipment,
  csvToDetergent
};