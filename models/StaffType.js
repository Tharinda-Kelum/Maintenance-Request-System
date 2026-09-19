const mongoose = require('mongoose');

const staffTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    enum: ['staff', 'hod', 'dean', 'technician', 'supervisor', 'authority', 'head'],
  },
  description: { type: String },
});

module.exports = mongoose.model('StaffType', staffTypeSchema);
