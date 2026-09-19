const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  request_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  message: { type: String, required: true },
  type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  is_read: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

notificationSchema.index({ recipient_id: 1, is_read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
