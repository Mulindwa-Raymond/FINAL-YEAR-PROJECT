/**
 * TCO Multiplier Routes
 * DEPRECATED: TCO is now calculated per equipment using stored values.
 * Kept for backward compatibility only.
 */

const express = require('express');
const { getTcoMultipliers, updateTcoMultipliers } = require('../../../controllers/adminController');
const { auth, requireAdmin } = require('../../../middleware/auth');

const router = express.Router();

router.get('/', auth, requireAdmin, getTcoMultipliers);
router.put('/', auth, requireAdmin, updateTcoMultipliers);

module.exports = router;