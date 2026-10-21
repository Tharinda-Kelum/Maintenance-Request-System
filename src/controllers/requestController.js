const mongoose = require('mongoose');
const Request = require('../models/Request');
const User = require('../models/User');
const Attachment = require('../models/Attachment');
const ItemRequest = require('../models/ItemRequest');
const InventoryItem = require('../models/InventoryItem');
const { fail, text, objectId, integer } = require('../utils/http');
const { ticketScope, scopedTicket, idOf } = require('../services/accessService');
const { settings, publicTicket, populateTicket, notifyWorkflow, notify, audit } = require('../services/portalService');

const read = async (user, reference) => {
  const ticket = await Request.findOne(await scopedTicket(user, reference));
  if (!ticket) fail(404, 'Request not found or not available to your account.');
  return ticket;
};
const result = async (ticket) => publicTicket(await populateTicket(Request.findById(ticket._id)));
const attachmentIds = async (value, user) => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 5 || new Set(value).size !== value.length) fail(400, 'Attach up to 5 distinct files.');
  for (const id of value) objectId(id, 'Attachment');
  const count = await Attachment.countDocuments({ _id: { $in: value }, uploadedBy: user._id, ticketId: null });
  if (count !== value.length) fail(400, 'One or more attachments are not available. Please attach the files again.');
  return value;
};
const optionalNote = (value) => text(value || '', 'Notes', 5000, false);
const readMaterials = async (value = [], minimum = 1) => {
  if (!Array.isArray(value) || value.length > 50) fail(400, 'Choose up to 50 materials.');
  const ids = value.map((row) => objectId(row?.itemId, 'Material'));
  if (new Set(ids).size !== ids.length) fail(400, 'Choose each material once and update its quantity.');
  const items = await InventoryItem.find({ _id: { $in: ids } });
  return value.map((row) => {
    const item = items.find((entry) => String(entry._id) === row.itemId);
    if (!item) fail(400, 'A selected material is no longer available. Choose it again.');
    if (!Number.isInteger(row.quantity) || row.quantity < minimum || row.quantity > 500) fail(400, `Material quantity must be a whole number from ${minimum} to 500.`);
    return { itemId: item._id, name: item.name, unit: item.unit, quantity: row.quantity };
  });
};
const describeMaterials = (items) => items.map((item) => `${item.name}: ${item.quantity} ${item.unit}`).join('\n');
const priorities = ['Low', 'Medium', 'High', 'Urgent'];
exports.getTickets = async (req, res) => {
  const tickets = await populateTicket(Request.find(await ticketScope(req.user)).sort({ createdAt: -1 }));
  res.json({ success: true, data: tickets.map(publicTicket) });
};
exports.getTicket = async (req, res) => res.json({ success: true, data: await result(await read(req.user, req.params.id)) });
exports.createTicket = async (req, res) => {
  const title = text(req.body.title, 'Issue title', 160);
  const description = text(req.body.description, 'Description', 5000);
  const issueType = text(req.body.category || req.body.issueType, 'Category', 100);
  const room = text(req.body.room || req.body.location, 'Room or location', 250);
  const building = text(req.body.building || '', 'Building', 250, false);
  const priority = req.body.priority || 'Medium';
  if (!priorities.includes(priority)) fail(400, 'Choose a valid priority.');
  const files = await attachmentIds(req.body.attachmentIds, req.user);
  const config = await settings();
  const ticket = await Request.create({
    title, description, issueType, room, building,
    location: [room, req.body.floor, building].filter(Boolean).join(', '),
    floor: text(req.body.floor || '', 'Floor', 100, false),
    locationFaculty: text(req.body.faculty || '', 'Location faculty', 250, false),
    locationDepartment: text(req.body.department || '', 'Location department', 250, false),
    locationNotes: text(req.body.locationNotes || '', 'Location notes', 1000, false),
    priority, responseHours: config.responseHours[priority],
    reporterId: req.user._id, departmentId: req.user.departmentId._id,
    attachments: files,
    timeline: [{ status: 'SUBMITTED', actor: req.user.name, actorId: req.user._id, note: 'Request submitted for HOD approval.' }]
  });
  await Attachment.updateMany({ _id: { $in: files } }, { $set: { ticketId: ticket._id } });
  await audit(req.user, 'SUBMIT_REQUEST', 'Requests', ticket.ticketNo, title);
  await notifyWorkflow(ticket);
  res.status(201).json({ success: true, data: await result(ticket) });
};

const change = async (req, allowedStatuses, nextStatus, patch, note) => {
  const current = await read(req.user, req.body.ticketId);
  if (!allowedStatuses.includes(current.status)) fail(409, 'This request has moved to another stage. Refresh it before continuing.');
  const ticket = await Request.findOneAndUpdate(
    { _id: current._id, status: current.status },
    { $set: { ...patch, status: nextStatus }, $push: { timeline: { status: nextStatus, actor: req.user.name, actorId: req.user._id, note } } },
    { new: true, runValidators: true }
  );
  if (!ticket) fail(409, 'Someone else updated this request. Refresh it before continuing.');
  await audit(req.user, nextStatus, 'Requests', ticket.ticketNo, note);
  await notifyWorkflow(ticket);
  return result(ticket);
};
exports.hodReview = async (req, res) => {
  if (typeof req.body.approve !== 'boolean') fail(400, 'Choose approve or reject.');
  const note = req.body.approve ? optionalNote(req.body.remarks) || 'HOD approved the request. Awaiting Dean approval.' : text(req.body.remarks, 'Reason for rejection');
  const patch = {};
  if (!req.body.approve) patch.rejectionReason = note;
  if (req.body.priority !== undefined) {
    if (!priorities.includes(req.body.priority)) fail(400, 'Choose a valid priority.');
    patch.priority = req.body.priority;
    patch.responseHours = (await settings()).responseHours[req.body.priority];
  }
  res.json({ success: true, data: await change(req, ['SUBMITTED'], req.body.approve ? 'HOD_APPROVED' : 'HOD_REJECTED', patch, note) });
};
exports.deanReview = async (req, res) => {
  if (typeof req.body.approve !== 'boolean') fail(400, 'Choose approve or reject.');
  const note = req.body.approve ? optionalNote(req.body.remarks) || 'Dean approved the request. Ready for the Head of Maintenance.' : text(req.body.remarks, 'Reason for rejection');
  res.json({ success: true, data: await change(req, ['HOD_APPROVED'], req.body.approve ? 'DEAN_APPROVED' : 'DEAN_REJECTED', req.body.approve ? {} : { rejectionReason: note }, note) });
};
exports.forwardToSupervisor = async (req, res) => {
  const supervisorId = objectId(req.body.supervisorId, 'Supervisor');
  const supervisor = await User.findOne({ _id: supervisorId, role: 'SUPERVISOR', isActive: { $ne: false } });
  if (!supervisor) fail(400, 'Choose an active maintenance supervisor.');
  const note = optionalNote(req.body.remarks) || `Forwarded to ${supervisor.name} to arrange the inspection.`;
  res.json({ success: true, data: await change(req, ['DEAN_APPROVED'], 'FORWARDED_TO_SUPERVISOR', { supervisorId }, note) });
};
exports.assignTechnician = async (req, res) => {
  const technicianId = objectId(req.body.technicianId, 'Technician');
  const technician = await User.findOne({ _id: technicianId, role: 'TECHNICIAN', isActive: { $ne: false } });
  if (!technician) fail(400, 'Choose an active technician.');
  const note = optionalNote(req.body.remarks) || `${technician.name} assigned to inspect the problem.`;
  res.json({ success: true, data: await change(req, ['FORWARDED_TO_SUPERVISOR'], 'TECHNICIAN_ASSIGNED', { assignedTechnicianId: technicianId }, note) });
};
exports.submitInspectionReport = async (req, res) => {
  const details = text(req.body.details, 'Inspection findings');
  const issueType = text(req.body.issueType, 'Issue type', 100);
  const materialNotes = optionalNote(req.body.requiredMaterials);
  const materials = await readMaterials(req.body.materials);
  const requiredMaterials = [describeMaterials(materials), materialNotes].filter(Boolean).join('\n');
  const estimatedTimeHours = req.body.estimatedTimeHours;
  if (typeof estimatedTimeHours !== 'number' || !Number.isFinite(estimatedTimeHours) || estimatedTimeHours <= 0 || estimatedTimeHours > 10000) fail(400, 'Enter an estimated time greater than zero and no more than 10,000 hours.');
  const patch = { inspectionReport: { details, issueType, requiredMaterials, materialNotes, materials, estimatedTimeHours, technicianId: req.user._id, submittedAt: new Date() } };
  res.json({ success: true, data: await change(req, ['TECHNICIAN_ASSIGNED'], 'INSPECTION_COMPLETED', patch, 'Technician submitted the inspection report. Supervisor will arrange the work.') });
};
exports.fulfillArrangements = async (req, res) => {
  if (typeof req.body.isCompleted !== 'boolean') fail(400, 'Choose whether the arrangements are complete.');
  if (req.body.isCompleted) fail(409, 'The technician must submit a completion report first. Review and rate that report to close the request.');
  const note = optionalNote(req.body.remarks) || 'Materials confirmed and sent to the assigned technician.';
  const current = await read(req.user, req.body.ticketId);
  const arrangementMaterials = await readMaterials(req.body.materials === undefined ? current.inspectionReport?.materials?.map((item) => ({ itemId: String(item.itemId), quantity: item.quantity })) : req.body.materials);
  res.json({ success: true, data: await change(req, ['INSPECTION_COMPLETED'], 'ARRANGEMENTS_IN_PROGRESS', { arrangements: note, arrangementMaterials }, `${note}\nArrangements ready. Assigned technician will complete the work and submit actual time and material usage.`) });
};
exports.submitCompletionReport = async (req, res) => {
  const details = text(req.body.details, 'Completed work details');
  const actualTimeMinutes = integer(req.body.actualTimeMinutes, 'Actual work time in minutes', 1, 600000);
  const materials = await readMaterials(req.body.materials, 0);
  const materialNotes = optionalNote(req.body.materialNotes);
  const completionReport = { details, actualTimeMinutes, materials, materialNotes, technicianId: req.user._id, submittedAt: new Date() };
  res.json({ success: true, data: await change(req, ['ARRANGEMENTS_IN_PROGRESS'], 'TECHNICIAN_COMPLETED', { completionReport }, `Technician completed the work in ${actualTimeMinutes} minutes and submitted actual material usage. Awaiting supervisor inspection and rating.`) });
};
exports.reviewCompletedWork = async (req, res) => {
  const rating = integer(req.body.rating, 'Work quality rating', 1, 5);
  const remarks = text(req.body.remarks, 'Supervisor verification notes');
  if (req.body.confirmed !== true) fail(400, 'Confirm that you checked the completed work and material usage.');
  const current = await read(req.user, req.body.ticketId);
  if (current.status !== 'TECHNICIAN_COMPLETED' || !current.completionReport?.submittedAt) fail(409, 'A technician completion report is required before checking and closing this request.');
  if (await ItemRequest.exists({ ticketId: current._id, status: { $in: ['PENDING', 'ISSUING', 'PURCHASE_REQUESTED'] } })) fail(409, 'There are outstanding parts or purchase requests. Issue or reject them before completing this request.');
  const supervisorReview = { rating, remarks, supervisorId: req.user._id, supervisorName: req.user.name, reviewedAt: new Date() };
  res.json({ success: true, data: await change(req, ['TECHNICIAN_COMPLETED'], 'COMPLETED', { supervisorReview, completionNotes: remarks, completedAt: new Date() }, `Supervisor checked the completed work and rated it ${rating}/5. ${remarks}`) });
};
exports.addComment = async (req, res) => {
  const ticket = await read(req.user, req.params.id);
  const files = await attachmentIds(req.body.attachmentIds, req.user);
  const content = text(req.body.text || '', 'Message', 5000, files.length === 0);
  const comment = { _id: new mongoose.Types.ObjectId(), author: req.user.name, authorId: req.user._id, role: req.user.role, text: content || `Added ${files.length} attachment(s).`, attachmentIds: files };
  await Request.updateOne({ _id: ticket._id }, { $push: { comments: comment, attachments: { $each: files } } });
  await Attachment.updateMany({ _id: { $in: files } }, { $set: { ticketId: ticket._id } });
  const recipients = [ticket.reporterId, ticket.supervisorId, ticket.assignedTechnicianId].filter((id) => id && idOf(id) !== idOf(req.user));
  await notify(recipients, ticket, `New message on ${ticket.ticketNo}`, `${req.user.name}: ${comment.text}`);
  res.status(201).json({ success: true, data: await result(ticket) });
};
exports.read = read;
