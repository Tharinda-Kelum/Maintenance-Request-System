const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  department_name: { type: String, required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null }, // null = top-level faculty
  head_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
});

module.exports = mongoose.model('Department', departmentSchema);
