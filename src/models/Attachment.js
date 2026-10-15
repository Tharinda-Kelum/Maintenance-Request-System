const mongoose = require('mongoose');
module.exports = mongoose.model('Attachment', new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', default: null },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true }
}, { timestamps: true }));
