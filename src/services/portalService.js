const PortalConfig = require('../models/PortalConfig');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const Department = require('../models/Department');
const { idOf } = require('./accessService');

const statusLabels = {
  SUBMITTED: 'Awaiting HOD approval', HOD_APPROVED: 'Awaiting Dean approval',
  HOD_REJECTED: 'Rejected by HOD', DEAN_APPROVED: 'Awaiting maintenance review',
  DEAN_REJECTED: 'Rejected by Dean', FORWARDED_TO_SUPERVISOR: 'Awaiting technician assignment',
  TECHNICIAN_ASSIGNED: 'Inspection in progress', INSPECTION_COMPLETED: 'Inspection completed',
  ARRANGEMENTS_IN_PROGRESS: 'Work in progress', PURCHASE_REQUESTED: 'Awaiting Finance approval',
  PURCHASE_APPROVED: 'Purchase approved by Finance', PURCHASE_REJECTED: 'Purchase rejected by Finance', PURCHASE_RECEIVED: 'Purchase received',
  PARTS_ISSUED: 'SR issued',
  TECHNICIAN_COMPLETED: 'Awaiting supervisor verification', COMPLETED: 'Completed'
};
const roleIds = { STAFF: 'general_user', HOD: 'dept_admin', DEAN: 'dean', HEAD_OF_MAINTENANCE: 'maintenance_head', SUPERVISOR: 'supervisor', TECHNICIAN: 'technician', STORE_KEEPER: 'store_keeper', FINANCE_HEAD: 'finance_head', SUPER_ADMIN: 'super_admin' };
const roleLabels = { STAFF: 'Staff member', HOD: 'Head of Department', DEAN: 'Dean', HEAD_OF_MAINTENANCE: 'Head of Maintenance', SUPERVISOR: 'Maintenance Supervisor', TECHNICIAN: 'Technician', STORE_KEEPER: 'Store Keeper', FINANCE_HEAD: 'Head of Finance', SUPER_ADMIN: 'System Administrator' };
const defaults = {
  systemName: 'Campus maintenance', campusHours: 'Mon–Fri: 08:00–16:30',
  supportEmail: 'maintenance@vau.ac.lk', supportExtension: '4211',
  responseHours: { Low: 72, Medium: 24, High: 12, Urgent: 4 }
};
const settings = async () => ({ ...defaults, ...((await PortalConfig.findById('settings').lean())?.value || {}) });
const displayTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const options = { timeZone: 'Asia/Colombo' };
  return `${date.toLocaleTimeString('en-US', { ...options, hour: '2-digit', minute: '2-digit' })}, ${new Intl.DateTimeFormat('en-CA', options).format(date)}`;
};
const publicUser = (user) => {
  const department = user.departmentId;
  const faculty = department?.parentId?.name || department?.name || '';
  return {
    id: idOf(user), name: user.name, username: user.username || user.email, email: user.email,
    backendRole: user.role, role: roleIds[user.role], roleName: roleLabels[user.role], roleLabel: roleLabels[user.role],
    departmentId: idOf(department), department: department?.name || '', faculty,
    phone: user.phone || '', trade: user.trade || '',
    avatar: user.name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase(),
    status: user.isActive === false ? 'Suspended' : 'Active', lastLogin: displayTime(user.lastLogin) || 'Never'
  };
};
const publicAttachment = (file) => ({ id: idOf(file), name: file.filename, size: `${((file.size || 0) / 1048576).toFixed(2)} MB`, type: file.mimetype, url: `/api/files/${idOf(file)}` });
const populateTicket = (query) => query.populate('reporterId', 'name email phone role')
  .populate({ path: 'departmentId', populate: { path: 'parentId' } })
  .populate('supervisorId', 'name email phone').populate('assignedTechnicianId', 'name email phone trade')
  .populate('attachments');
const publicTicket = (ticket) => {
  const partsEvent = [...(ticket.timeline || [])].reverse().find((event) => event.status.startsWith('PURCHASE_') || event.status.startsWith('PARTS_'));
  return {
  id: ticket.ticketNo, backendId: idOf(ticket), title: ticket.title || ticket.issueType,
  workflowStatus: ticket.status, status: statusLabels[ticket.status] || ticket.status,
  category: ticket.issueType, priority: ticket.priority || 'Medium',
  faculty: ticket.departmentId?.parentId?.name || ticket.departmentId?.name || '',
  department: ticket.departmentId?.name || '', departmentId: idOf(ticket.departmentId),
  building: ticket.building || ticket.location, floor: ticket.floor || '', room: ticket.room || ticket.location,
  location: ticket.location, locationNotes: ticket.locationNotes || '',
  description: ticket.description,
  requester: { id: idOf(ticket.reporterId), name: ticket.reporterId?.name || 'Staff member', email: ticket.reporterId?.email || '', phone: ticket.reporterId?.phone || '', role: roleLabels[ticket.reporterId?.role] || 'Staff member' },
  supervisor: ticket.supervisorId ? { id: idOf(ticket.supervisorId), name: ticket.supervisorId.name, phone: ticket.supervisorId.phone } : null,
  assignedTo: ticket.assignedTechnicianId ? { id: idOf(ticket.assignedTechnicianId), name: ticket.assignedTechnicianId.name, trade: ticket.assignedTechnicianId.trade || 'Technician', phone: ticket.assignedTechnicianId.phone } : null,
  submittedAt: displayTime(ticket.createdAt), lastUpdated: displayTime(ticket.updatedAt),
  createdAt: ticket.createdAt, updatedAt: ticket.updatedAt, slaDue: `${ticket.responseHours || 24} hours`,
  timeline: (ticket.timeline || []).map((event) => ({ id: idOf(event), status: statusLabels[event.status] || event.status, workflowStatus: event.status, time: displayTime(event.createdAt), actor: event.actor, note: event.note })),
  partsRequestStatus: partsEvent ? { status: statusLabels[partsEvent.status] || partsEvent.status, workflowStatus: partsEvent.status, time: displayTime(partsEvent.createdAt), note: partsEvent.note } : null,
  comments: (ticket.comments || []).map((comment) => ({ id: idOf(comment), author: comment.author, role: roleLabels[comment.role] || comment.role, time: displayTime(comment.createdAt), text: comment.text })),
  attachments: (ticket.attachments || []).map(publicAttachment),
  inspectionReport: ticket.inspectionReport?.submittedAt ? { ...ticket.inspectionReport.toObject(), submittedAt: displayTime(ticket.inspectionReport.submittedAt) } : null,
  arrangements: ticket.arrangements || '', arrangementMaterials: ticket.arrangementMaterials || [], completionNotes: ticket.completionNotes || '',
  completionReport: ticket.completionReport?.submittedAt ? { ...ticket.completionReport.toObject(), submittedAt: displayTime(ticket.completionReport.submittedAt) } : null,
  supervisorReview: ticket.supervisorReview?.reviewedAt ? { ...ticket.supervisorReview.toObject(), reviewedAt: displayTime(ticket.supervisorReview.reviewedAt) } : null,
  rejectionReason: ticket.rejectionReason || '', completedAt: ticket.completedAt
  };
};
const audit = async (user, action, module, target, details = '') => {
  await AuditLog.create({ user: user.name, userRole: roleLabels[user.role], action, module, target: String(target), details });
};
const notify = async (userIds, ticket, title, message, category = 'Requests') => {
  const ids = [...new Set(userIds.filter(Boolean).map(idOf))];
  if (!ids.length) return;
  await Notification.insertMany(ids.map((userId) => ({ userId, ticketId: ticket._id, title, message, category })));
};
const notifyWorkflow = async (ticket) => {
  let recipients = [];
  if (ticket.status === 'SUBMITTED') recipients = await User.find({ role: 'HOD', departmentId: ticket.departmentId, isActive: { $ne: false } }).distinct('_id');
  if (ticket.status === 'HOD_APPROVED') {
    let department = await Department.findById(ticket.departmentId);
    const ancestors = [];
    while (department) { ancestors.push(department._id); department = department.parentId ? await Department.findById(department.parentId) : null; }
    recipients = await User.find({ role: 'DEAN', departmentId: { $in: ancestors }, isActive: { $ne: false } }).distinct('_id');
  }
  if (ticket.status === 'DEAN_APPROVED') recipients = await User.find({ role: 'HEAD_OF_MAINTENANCE', isActive: { $ne: false } }).distinct('_id');
  if (['FORWARDED_TO_SUPERVISOR', 'INSPECTION_COMPLETED', 'TECHNICIAN_COMPLETED'].includes(ticket.status)) recipients = [ticket.supervisorId];
  if (['TECHNICIAN_ASSIGNED', 'ARRANGEMENTS_IN_PROGRESS'].includes(ticket.status)) recipients = [ticket.assignedTechnicianId];
  if (ticket.status === 'COMPLETED') recipients = [ticket.supervisorId, ticket.assignedTechnicianId];
  await notify([...recipients, ticket.reporterId], ticket, `${ticket.ticketNo}: ${statusLabels[ticket.status]}`, ticket.timeline.at(-1)?.note || statusLabels[ticket.status]);
};
module.exports = { statusLabels, roleIds, roleLabels, defaults, settings, displayTime, publicUser, publicAttachment, populateTicket, publicTicket, audit, notify, notifyWorkflow };
