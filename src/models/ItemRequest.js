const mongoose = require('mongoose');
module.exports = mongoose.model('ItemRequest', new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  quantityRequested: { type: Number, required: true, min: 1 },
  urgency: { type: String, enum: ['Urgent', 'High', 'Normal'], default: 'Normal' },
  status: { type: String, enum: ['PENDING', 'ISSUING', 'ISSUED', 'REJECTED'], default: 'PENDING' },
  rejectionReason: String
}, { timestamps: true }));
