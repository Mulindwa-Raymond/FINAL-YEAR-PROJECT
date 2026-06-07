/**
 * Training Model
 * Stores training materials (videos, PDFs, articles) linked to equipment.
 */

const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    type: {
      type: String,
      enum: ['video', 'pdf', 'article'],
      required: true,
      default: 'video',
    },
    youtubeUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
        },
        message: 'Invalid YouTube URL',
      },
    },
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
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Ensure at least one URL is provided based on type
trainingSchema.pre('save', function (next) {
  if (this.type === 'video' && !this.youtubeUrl) {
    next(new Error('YouTube URL is required for video type'));
  } else if ((this.type === 'pdf' || this.type === 'article') && !this.url) {
    next(new Error('Resource URL is required for PDF/article type'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Training', trainingSchema);