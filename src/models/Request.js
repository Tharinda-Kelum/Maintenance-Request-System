const mongoose = require('mongoose');
const { randomUUID } = require('node:crypto');
const ref = (name, required = false) => ({ type: mongoose.Schema.Types.ObjectId, ref: name, required });
const material = new mongoose.Schema({ itemId: ref('InventoryItem', true), name: String, unit: String, quantity: { type: Number, min: 0, max: 500, required: true } }, { _id: false });
const event = new mongoose.Schema({
  status: String, actor: String, actorId: ref('User'), note: String,
  createdAt: { type: Date, default: Date.now }
});
const comment = new mongoose.Schema({
  author: String, authorId: ref('User'), role: String, text: { type: String, maxlength: 5000 },
  attachmentIds: [ref('Attachment')], createdAt: { type: Date, default: Date.now }
});
const schema = new mongoose.Schema({
  ticketNo: { type: String, unique: true, default: () => `MRS-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}` },
  title: { type: String, trim: true, maxlength: 160, default: '' },
  location: { type: String, required: true, maxlength: 1200 },
  issueType: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 5000 },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  responseHours: { type: Number, default: 24 },
  building: String, floor: String, room: String, locationNotes: String,
  locationFaculty: String, locationDepartment: String,
  status: { type: String, enum: ['SUBMITTED', 'HOD_APPROVED', 'HOD_REJECTED', 'DEAN_APPROVED', 'DEAN_REJECTED', 'FORWARDED_TO_SUPERVISOR', 'TECHNICIAN_ASSIGNED', 'INSPECTION_COMPLETED', 'ARRANGEMENTS_IN_PROGRESS', 'TECHNICIAN_COMPLETED', 'COMPLETED'], default: 'SUBMITTED', index: true },
  reporterId: ref('User', true), departmentId: ref('Department', true),
  supervisorId: ref('User'), assignedTechnicianId: ref('User'),
  rejectionReason: { type: String, default: '' },
  attachments: [ref('Attachment')],
  timeline: [event], comments: [comment],
  inspectionReport: {
    issueType: String, details: String, requiredMaterials: String, materialNotes: String, materials: [material],
    estimatedTimeHours: Number, technicianId: ref('User'), submittedAt: Date
  },
  arrangements: { type: String, default: '' },
  arrangementMaterials: [material],
  completionReport: {
    details: String, actualTimeMinutes: { type: Number, min: 1, max: 600000 },
    materials: [material], materialNotes: String, technicianId: ref('User'), submittedAt: Date
  },
  supervisorReview: {
    rating: { type: Number, min: 1, max: 5 }, remarks: String,
    supervisorId: ref('User'), supervisorName: String, reviewedAt: Date
  },
  completionNotes: { type: String, default: '' },
  completedAt: Date
}, { timestamps: true });
schema.index({ reporterId: 1, createdAt: -1 });
schema.index({ departmentId: 1, status: 1 });
schema.index({ assignedTechnicianId: 1 });
schema.index({ supervisorId: 1 });
module.exports = mongoose.model('Request', schema);
