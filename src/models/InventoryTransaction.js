const mongoose = require('mongoose');
module.exports = mongoose.model('InventoryTransaction', new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  type: String, itemCode: String, itemName: String, quantity: Number,
  issuedTo: String, ticketRef: String, authorizedBy: String,
  createdAt: { type: Date, default: Date.now }
}));
