const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantityToPurchase: { type: Number, required: true, min: 1 },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED_BY_DEAN', 'PURCHASED', 'REJECTED'], 
    default: 'PENDING' 
  },
  remarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);