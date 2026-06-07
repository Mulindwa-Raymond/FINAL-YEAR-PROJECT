const Training = require('../models/Training');
const { success, error } = require('../utils/apiResponse');

const getAllTrainings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, type, active } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (type) filter.type = type;
    if (active !== undefined) filter.active = active === 'true';

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
};

const getTrainingById = async (req, res, next) => {
  try {
    const training = await Training.findById(req.params.id).populate('machineId', 'brand_name model_name');
    if (!training) return error(res, 'Training not found', 404);
    return success(res, training, 'Training retrieved');
  } catch (err) {
    next(err);
  }
};

const createTraining = async (req, res, next) => {
  try {
    const training = new Training(req.body);
    await training.save();
    return success(res, training, 'Training created', 201);
  } catch (err) {
    next(err);
  }
};

// ✅ EDIT / UPDATE
const updateTraining = async (req, res, next) => {
  try {
    const training = await Training.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!training) return error(res, 'Training not found', 404);
    return success(res, training, 'Training updated');
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE
const deleteTraining = async (req, res, next) => {
  try {
    const training = await Training.findByIdAndDelete(req.params.id);
    if (!training) return error(res, 'Training not found', 404);
    return success(res, null, 'Training deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
};