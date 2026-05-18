/**
 * AuditLog Model
 * Records every action performed by admin users (create, update, delete, upload, etc.).
 * Useful for compliance and debugging.
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin user ID is required']
  },
  action: {
    type: String,
    required: [true, 'Action type is required'],
    enum: [
      'CREATE_USER', 'UPDATE_USER', 'DELETE_USER',
      'CREATE_EQUIPMENT', 'UPDATE_EQUIPMENT', 'DELETE_EQUIPMENT',
      'CREATE_DETERGENT', 'UPDATE_DETERGENT', 'DELETE_DETERGENT',
      'CREATE_RULE', 'UPDATE_RULE', 'DELETE_RULE',
      'BULK_UPLOAD_EQUIPMENT', 'BULK_UPLOAD_DETERGENTS', 'BULK_UPLOAD_RULES',
      'UPDATE_TCO_MULTIPLIERS', 'IMPORT_DATABASE', 'EXPORT_DATABASE'
    ]
  },
  targetType: {
    type: String,
    enum: ['User', 'Equipment', 'Detergent', 'Rule', 'TcoMultiplier']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    description: 'Additional data (e.g., changes made, upload stats)'
  },
  ipAddress: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for fast querying by admin and time
auditLogSchema.index({ adminId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);