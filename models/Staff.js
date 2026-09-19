const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'StaffType', required: true },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true }, // stored hashed — not usable as a lookup key
  phone: { type: String },
});

module.exports = mongoose.model('Staff', staffSchema);
