const mongoose = require('mongoose');
const { Schema } = mongoose;

// ---- Embedded sub-schemas ----

const reportSchema = new Schema({
  technician_id: { type: Schema.Types.ObjectId, ref: 'Staff' },
  diagnosis: { type: String, required: true },
  items_needed: [{
    item_id: { type: Schema.Types.ObjectId, ref: 'Item' },
    item_name: String,
    qty: Number,
    available_in_store: Boolean,
  }],
  estimated_cost: { type: Number },
  submitted_at: { type: Date, default: Date.now },
}, { _id: false });

const purchaseRequestSchema = new Schema({
  items: [{ item_name: String, qty: Number, estimated_cost: Number }],
  status_id: { type: Schema.Types.ObjectId, ref: 'State' },
  requested_by: { type: Schema.Types.ObjectId, ref: 'Staff' },
  approved_by: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
  created_at: { type: Date, default: Date.now },
  decided_at: { type: Date, default: null },
});

const stockRequestSchema = new Schema({
  items: [{ item_id: { type: Schema.Types.ObjectId, ref: 'Item' }, qty: Number }],
  status_id: { type: Schema.Types.ObjectId, ref: 'State' },
  requested_by: { type: Schema.Types.ObjectId, ref: 'Staff' },
  issued_by: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
  created_at: { type: Date, default: Date.now },
  issued_at: { type: Date, default: null },
});

const inspectionSchema = new Schema({
  inspector_id: { type: Schema.Types.ObjectId, ref: 'Staff' },
  inspection_level_id: { type: Schema.Types.ObjectId, ref: 'State' }, // supervisor / authority
  result_id: { type: Schema.Types.ObjectId, ref: 'State' },           // passed / failed / needs_rework
  remarks: { type: String },
  inspected_at: { type: Date, default: Date.now },
});

const attachmentSchema = new Schema({
  file_name: { type: String, required: true },
  file_path: { type: String, required: true },
  uploaded_by: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  uploaded_at: { type: Date, default: Date.now },
});

// ---- Main Request schema ----

const requestSchema = new Schema({
  originator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
  priority_id: { type: Schema.Types.ObjectId, ref: 'State', required: true },
  job: { type: String, required: true },
  category: { type: String },
  location: { type: String },

  // Snapshot of the escalation route at creation time (replaces a standing Manager/reports_to table)
  escalation_path: {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    hod: { type: Schema.Types.ObjectId, ref: 'Staff' },
    dean: { type: Schema.Types.ObjectId, ref: 'Staff' },
  },

  current_handler: { type: Schema.Types.ObjectId, ref: 'Staff' },
  remarks: { type: String },
  closed_at: { type: Date, default: null },

  // Embedded child records — bounded per request, always read together with the parent
  report: { type: reportSchema, default: null },
  purchase_requests: { type: [purchaseRequestSchema], default: [] },
  stock_requests: { type: [stockRequestSchema], default: [] },
  inspections: { type: [inspectionSchema], default: [] },
  attachments: { type: [attachmentSchema], default: [] },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

requestSchema.index({ originator: 1 });
requestSchema.index({ current_handler: 1 });
requestSchema.index({ recipient: 1, closed_at: 1 });

module.exports = mongoose.model('Request', requestSchema);
