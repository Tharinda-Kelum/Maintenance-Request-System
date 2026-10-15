const mongoose = require('mongoose');

const ROLES = ['STAFF', 'HOD', 'DEAN', 'HEAD_OF_MAINTENANCE', 'SUPERVISOR', 'TECHNICIAN', 'STORE_KEEPER', 'SUPER_ADMIN'];
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, required: true, enum: ROLES },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  phone: { type: String, default: '' },
  trade: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sessionVersion: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  lastLogin: Date
}, { timestamps: true });

module.exports = mongoose.model('User', schema);
module.exports.ROLES = ROLES;
