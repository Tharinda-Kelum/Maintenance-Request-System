const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  itemRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemRequest' },
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', default: null },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantityToPurchase: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'PURCHASED', 'REJECTED'],
    default: 'PENDING'
  },
  remarks: { type: String, default: '' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  approvedAt: Date,
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  rejectedAt: Date,
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  receivedAt: Date
}, { timestamps: true });

purchaseRequestSchema.index({ itemRequestId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);
