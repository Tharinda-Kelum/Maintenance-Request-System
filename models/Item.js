const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  category: { type: String },
  unit: { type: String },
  unit_cost: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
