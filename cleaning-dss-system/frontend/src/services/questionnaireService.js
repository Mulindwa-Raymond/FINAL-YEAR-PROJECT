/**
 * questionnaireService.js
 * Converts user answers from the dynamic questionnaire into API filters
 * for the recommendation engine.
 */

import { getCategoryQuestions } from '../utils/categoryQuestions';

/**
 * Process user answers and generate filter object for API
 * @param {string} categoryId - Machine category ID
 * @param {Object} answers - User answers from questionnaire
 * @returns {Object} Filter object ready for API call
 */
export const processAnswers = (categoryId, answers) => {
  const categoryConfig = getCategoryQuestions(categoryId);
  if (!categoryConfig) {
    throw new Error(`No questionnaire configuration found for category: ${categoryId}`);
  }

  // Get the mapping function from the config
  const filters = categoryConfig.mapToFilters(answers);

  // Add common fields that all categories use
  const result = {
    machine_category: categoryId,
    ...filters,
    // Always include these base fields
    area_size: answers.area_size || null,
    surface_type: answers.floor_type || answers.surface_type || null,
    dirt_type: answers.dirt_type || answers.soil_type || answers.debris_type || null,
    power_stability: answers.power_stability || 'stable',
    budget_ugx: answers.budget || 0,
    eco_preference: answers.eco_preference || false,
  };

  // Remove undefined values
  Object.keys(result).forEach(key => {
    if (result[key] === undefined || result[key] === null) {
      delete result[key];
    }
  });

  return result;
};

/**
 * Get the step-by-step questions for a category
 * @param {string} categoryId - Machine category ID
 * @returns {Array} List of question steps
 */
export const getQuestionsForCategory = (categoryId) => {
  const config = getCategoryQuestions(categoryId);
  return config?.steps || [];
};

/**
 * Validate that all required answers are present before submission
 * @param {string} categoryId - Machine category ID
 * @param {Object} answers - User answers
 * @returns {Object} { valid: boolean, missingFields: Array }
 */
export const validateAnswers = (categoryId, answers) => {
  const steps = getQuestionsForCategory(categoryId);
  const missingFields = [];

  for (const step of steps) {
    const value = answers[step.id];
    if ((value === undefined || value === null || value === '') &&
        step.type !== 'checkbox' &&
        step.type !== 'multiselect') {
      missingFields.push(step.title);
    }
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
};

/**
 * Generate a summary of user selections for display
 * @param {Object} answers - User answers
 * @returns {Array} Summary items
 */
export const generateSummary = (answers) => {
  const summary = [];

  const mappings = {
    area_size: { label: 'Area Size', unit: 'm²' },
    surface_type: { label: 'Surface Type' },
    dirt_type: { label: 'Dirt Type' },
    environment: { label: 'Environment' },
    power_source: { label: 'Power Source' },
    soil_level: { label: 'Soil Level' },
    noise_sensitivity: { label: 'Noise Sensitivity' },
  };

  for (const [key, config] of Object.entries(mappings)) {
    if (answers[key]) {
      summary.push({
        label: config.label,
        value: answers[key],
        unit: config.unit,
      });
    }
  }

  return summary;
};