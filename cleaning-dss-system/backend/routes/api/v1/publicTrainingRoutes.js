const express = require('express');
const Training = require('../../../models/Training');
const { success, error } = require('../../../utils/apiResponse');
const { cacheMiddleware, cacheConfigs } = require('../../../middleware/cache');

const router = express.Router();

// GET /api/v1/training/public - list active trainings (with caching)
router.get('/', cacheMiddleware(cacheConfigs.lists), async (req, res, next) => {
  try {
    const { search, type, page = 1, limit = 20 } = req.query;
    const filter = { active: true };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (type) filter.type = type;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const trainings = await Training.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('machineId', 'brand_name model_name');
    const total = await Training.countDocuments(filter);
    return success(res, { trainings, total, page: parseInt(page), limit: parseInt(limit) }, 'Trainings retrieved');
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/training/public/:id - get single training by ID
router.get('/:id', async (req, res, next) => {
  try {
    const training = await Training.findOne({ _id: req.params.id, active: true }).populate('machineId', 'brand_name model_name');
    if (!training) return error(res, 'Training not found', 404);
    return success(res, training, 'Training retrieved');
  } catch (err) {
    next(err);
  }
});

module.exports = router;