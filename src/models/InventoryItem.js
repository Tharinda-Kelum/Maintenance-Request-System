const mongoose = require('mongoose');
module.exports = mongoose.model('InventoryItem', new mongoose.Schema({
  code: { type: String, unique: true, sparse: true },
  name: { type: String, required: true, unique: true },
  category: { type: String, default: 'General' },
  unit: { type: String, default: 'pcs' },
  unitCost: { type: String, default: '' },
  location: { type: String, default: 'Central Stores' },
  quantityAvailable: { type: Number, min: 0, default: 0 },
  reorderLevel: { type: Number, min: 0, default: 5 },
  issuedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ItemRequest' }],
  receivedPurchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseRequest' }]
}, { timestamps: true }));
