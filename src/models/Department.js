const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    default: null // Null for top-level entities like Faculties or Main Divisions
  },
  hodId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);