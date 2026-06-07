const express = require('express');
const {
  getAllTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
} = require('../../../controllers/trainingController');
const { auth, requireAdmin } = require('../../../middleware/auth');

const router = express.Router();

// All training routes require admin authentication
router.use(auth, requireAdmin);

router.get('/', getAllTrainings);
router.get('/:id', getTrainingById);
router.post('/', createTraining);
router.put('/:id', updateTraining);
router.delete('/:id', deleteTraining);

module.exports = router;