const fs = require('fs');
const csv = require('csv-parser');
const Equipment = require('../models/Equipment');
const Detergent = require('../models/Detergent');
const Rule = require('../models/Rule');

/**
 * Parse CSV file and return array of objects.
 * @param {string} filePath - Path to CSV file.
 * @returns {Promise<Array>}
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

/**
 * Import equipment from CSV or JSON.
 * @param {string} filePath - Path to file.
 * @param {string} format - 'csv' or 'json'.
 * @returns {Promise<Object>} { insertedCount, errors }
 */
const importEquipment = async (filePath, format = 'csv') => {
  let data;
  if (format === 'csv') {
    data = await parseCSV(filePath);
  } else {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  let inserted = 0, errors = [];
  for (const item of data) {
    try {
      await Equipment.create(item);
      inserted++;
    } catch (err) {
      errors.push({ item, error: err.message });
    }
  }
  return { insertedCount: inserted, errors };
};

/**
 * Import detergents from CSV or JSON.
 */
const importDetergents = async (filePath, format = 'csv') => {
  let data;
  if (format === 'csv') {
    data = await parseCSV(filePath);
  } else {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  let inserted = 0, errors = [];
  for (const item of data) {
    try {
      await Detergent.create(item);
      inserted++;
    } catch (err) {
      errors.push({ item, error: err.message });
    }
  }
  return { insertedCount: inserted, errors };
};

/**
 * Import rules from CSV or JSON.
 */
const importRules = async (filePath, format = 'csv') => {
  let data;
  if (format === 'csv') {
    data = await parseCSV(filePath);
  } else {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  let inserted = 0, errors = [];
  for (const item of data) {
    try {
      await Rule.create(item);
      inserted++;
    } catch (err) {
      errors.push({ item, error: err.message });
    }
  }
  return { insertedCount: inserted, errors };
};

module.exports = { importEquipment, importDetergents, importRules, parseCSV };