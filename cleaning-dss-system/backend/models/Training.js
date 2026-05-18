// models/Training.js
const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Training title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['video', 'pdf', 'article'],
    default: 'video',
  },
  youtubeUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
      },
      message: 'Invalid YouTube URL',
    },
  },
  // Alternative generic URL (if not YouTube)
  url: {
    type: String,
    trim: true,
  },
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Training', trainingSchema);