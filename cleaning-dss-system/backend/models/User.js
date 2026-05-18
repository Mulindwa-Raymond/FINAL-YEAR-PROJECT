/**
 * User Model
 * Stores system user account information.
 * Updated to match ERD: added organization field, removed unnecessary fields.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required'],
    select: false  // Don't return password by default
  },
  role: {
    type: String,
    enum: ['standard', 'admin', 'super_admin'],
    default: 'standard',
    required: true
  },
  organization: {
    type: String,
    maxlength: 100,
    trim: true,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: false,  // Using custom created_at
  toJSON: {
    transform: (doc, ret) => {
      ret.user_id = ret._id;
      delete ret.__v;
      delete ret.password_hash;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ created_at: -1 });

module.exports = mongoose.model('User', userSchema);