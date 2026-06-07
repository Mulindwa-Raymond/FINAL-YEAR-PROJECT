/**
 * Validation Middleware
 * Uses Joi schemas to validate request bodies, query parameters, and URL params.
 */

const Joi = require('joi');

// ---- Schemas ----

const stringOrArrayOfString = Joi.alternatives().try(
  Joi.string(),
  Joi.array().items(Joi.string())
).optional();

// Recommendation request schema (POST /api/v1/recommend)
const recommendationSchema = Joi.object({
  surface_type: stringOrArrayOfString,
  surfaceType: stringOrArrayOfString,
  dirt_type: stringOrArrayOfString,
  dirtType: stringOrArrayOfString,
  debris_type: stringOrArrayOfString,
  domain: Joi.string().optional(),
  usageHoursPerWeek: Joi.number().min(0).default(0),
  areaSizeM2: Joi.number().min(0).default(0),
  area_size: Joi.number().min(0).default(0),
  budgetUgx: Joi.number().min(0).allow(null),
  budget_ugx: Joi.number().min(0).allow(null),
  powerStability: Joi.string().valid('stable', 'unstable').default('stable'),
  power_stability: Joi.string().valid('stable', 'unstable').default('stable'),
  ecoRequired: Joi.boolean().default(false),
  eco_preference: Joi.boolean().default(false),
  noiseSensitive: Joi.boolean().default(false),
  noise_sensitivity: Joi.string().optional(),
  operation_mode: Joi.string().optional(),
  special_requirements: stringOrArrayOfString,
}).unknown();

// User registration schema
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// User login schema
const loginSchema = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().required()
}).xor('username', 'email'); // either username or email must be provided

// Change password schema
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// Equipment create/update schema (simplified)
const equipmentSchema = Joi.object({
  name: Joi.string().required(),
  brand: Joi.string().valid('Kärcher', 'Nilfisk', 'Numatic').required(),
  category: Joi.string().required(),
  intensity: Joi.string().valid('light', 'medium', 'heavy').required(),
  domain: Joi.string().valid('domestic', 'industrial').required(),
  price_ugx: Joi.number().min(0).required(),
  spare_part_lead_time_days: Joi.number().min(0).default(14),
  in_stock: Joi.boolean().default(true),
  active: Joi.boolean().default(true)
  // other fields can be added as needed
});

// ---- Middleware factories ----

/**
 * Generic validator factory.
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - 'body', 'query', or 'params' (default 'body')
 * @returns {Function} Express middleware
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }
    next();
  };
};

// Specific validators (pre‑configured)
const validateRecommendationRequest = validate(recommendationSchema, 'body');
const validateRegistration = validate(registerSchema, 'body');
const validateLogin = validate(loginSchema, 'body');
const validateChangePassword = validate(changePasswordSchema, 'body');
const validateEquipment = validate(equipmentSchema, 'body');

module.exports = {
  validate,
  validateRecommendationRequest,
  validateRegistration,
  validateLogin,
  validateChangePassword,
  validateEquipment,
  // export schemas if needed elsewhere
  schemas: { recommendationSchema, registerSchema, loginSchema, changePasswordSchema, equipmentSchema }
};