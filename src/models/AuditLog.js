const mongoose = require('mongoose');
module.exports = mongoose.model('AuditLog', new mongoose.Schema({
  user: String, userRole: String, action: String, module: String,
  target: String, details: String, ip: String,
  createdAt: { type: Date, default: Date.now }
}));
