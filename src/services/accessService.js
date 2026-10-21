const mongoose = require('mongoose');
const Department = require('../models/Department');
const PurchaseRequest = require('../models/PurchaseRequest');
const { fail } = require('../utils/http');

const idOf = (value) => String(value?._id || value || '');
const departmentIds = async (rootId) => {
  const departments = await Department.find().lean();
  const ids = new Set([idOf(rootId)]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const department of departments) {
      if (ids.has(idOf(department.parentId)) && !ids.has(idOf(department))) { ids.add(idOf(department)); changed = true; }
    }
  }
  return [...ids];
};
const ticketScope = async (user) => {
  switch (user.role) {
    case 'STAFF': return { reporterId: user._id };
    case 'HOD': return { departmentId: user.departmentId._id || user.departmentId };
    case 'DEAN': return { departmentId: { $in: await departmentIds(user.departmentId) } };
    case 'TECHNICIAN': return { assignedTechnicianId: user._id };
    case 'SUPERVISOR': return { supervisorId: user._id };
    case 'HEAD_OF_MAINTENANCE': return { status: { $in: ['DEAN_APPROVED', 'FORWARDED_TO_SUPERVISOR', 'TECHNICIAN_ASSIGNED', 'INSPECTION_COMPLETED', 'ARRANGEMENTS_IN_PROGRESS', 'TECHNICIAN_COMPLETED', 'COMPLETED'] } };
    case 'STORE_KEEPER': case 'SUPER_ADMIN': return {};
    case 'FINANCE_HEAD': return { _id: { $in: await PurchaseRequest.find({ ticketId: { $ne: null } }).distinct('ticketId') } };
    default: fail(403, 'This account cannot access maintenance requests.');
  }
};
const ticketKey = (value) => {
  if (typeof value !== 'string' || value.length > 80) fail(400, 'Request reference is invalid.');
  return mongoose.isValidObjectId(value) ? { _id: value } : { ticketNo: value };
};
const scopedTicket = async (user, value) => ({ $and: [ticketKey(value), await ticketScope(user)] });
module.exports = { idOf, departmentIds, ticketScope, ticketKey, scopedTicket };
