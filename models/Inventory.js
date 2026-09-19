const mongoose = require('mongoose');

// Embedded log entry — only populated on the central record (department_id: null).
const distributionEntrySchema = new mongoose.Schema({
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  quantity: { type: Number, required: true },
  distributed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  distributed_at: { type: Date, default: Date.now },
  remarks: { type: String },
}, { _id: false });

// One document per item PER LOCATION.
// department_id: null  -> central/main store record
// department_id: <id>  -> that department's local store record
const inventorySchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  quantity_available: { type: Number, required: true, default: 0 },
  minimum_threshold: { type: Number, default: 0 },
  distribution_log: { type: [distributionEntrySchema], default: [] }, // only meaningful when department_id is null
}, { timestamps: { createdAt: false, updatedAt: 'updated_at' } });

// One record per item per location — central included (department_id: null counts as one location per item).
inventorySchema.index({ item_id: 1, department_id: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
