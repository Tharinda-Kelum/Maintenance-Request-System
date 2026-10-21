const mongoose = require('mongoose');

const staffTypeSchema = new mongoose.Schema({
  typeName: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['STAFF', 'HOD', 'DEAN', 'HEAD_OF_MAINTENANCE', 'SUPERVISOR', 'TECHNICIAN', 'STORE_KEEPER', 'FINANCE_HEAD']
  },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('StaffType', staffTypeSchema);