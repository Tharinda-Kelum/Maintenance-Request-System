const { randomUUID } = require('node:crypto');
const InventoryItem = require('../models/InventoryItem');
const ItemRequest = require('../models/ItemRequest');
const Transaction = require('../models/InventoryTransaction');
const User = require('../models/User');
const { read } = require('./requestController');
const { ticketScope, idOf } = require('../services/accessService');
const Request = require('../models/Request');
const { audit, notify, displayTime } = require('../services/portalService');
const { fail, text, integer, objectId } = require('../utils/http');

const publicItem = (item) => ({
  id: idOf(item), code: item.code || idOf(item), name: item.name,
  category: item.category || 'General', unit: item.unit || 'pcs',
  unitCost: item.unitCost || '', location: item.location || 'Central Stores',
  stock: item.quantityAvailable, reorderLevel: item.reorderLevel,
  status: item.quantityAvailable === 0 ? 'Out of Stock' : item.quantityAvailable <= item.reorderLevel ? 'Low Stock' : 'In Stock'
});
const populatePart = (query) => query.populate('ticketId', 'ticketNo room supervisorId').populate('technicianId', 'name trade').populate('itemId');
const publicPart = (request) => ({
  id: idOf(request), ticketId: request.ticketId?.ticketNo,
  technician: request.technicianId?.name, technicianTrade: request.technicianId?.trade || 'Technician',
  itemId: idOf(request.itemId), itemCode: request.itemId?.code || '', itemName: request.itemId?.name || 'Item',
  quantity: request.quantityRequested, unit: request.itemId?.unit || 'pcs',
  urgency: request.urgency || 'Normal', requestedAt: displayTime(request.createdAt),
  status: ({ PENDING: 'Pending', ISSUING: 'Issuing', ISSUED: 'Issued', REJECTED: 'Rejected' })[request.status],
  notes: request.rejectionReason || request.ticketId?.room || ''
});
exports.getInventoryItems = async (req, res) => res.json({ success: true, data: (await InventoryItem.find().sort({ name: 1 })).map(publicItem) });
exports.getRequests = async (req, res) => {
  let filter = {};
  if (req.user.role === 'TECHNICIAN') filter = { technicianId: req.user._id };
  if (req.user.role === 'SUPERVISOR') filter = { ticketId: { $in: await Request.find(await ticketScope(req.user)).distinct('_id') } };
  res.json({ success: true, data: (await populatePart(ItemRequest.find(filter).sort({ createdAt: -1 }))).map(publicPart) });
};
exports.createRequest = async (req, res) => {
  const ticket = await read(req.user, req.body.ticketId);
  if (!['TECHNICIAN_ASSIGNED', 'INSPECTION_COMPLETED', 'ARRANGEMENTS_IN_PROGRESS'].includes(ticket.status)) fail(409, 'Parts can be requested during inspection and arrangements.');
  const item = await InventoryItem.findById(objectId(req.body.itemId, 'Item'));
  if (!item) fail(404, 'Stock item not found.');
  const quantityRequested = integer(req.body.quantity, 'Quantity', 1, 500);
  const urgency = req.body.urgency || 'Normal';
  if (!['Urgent', 'High', 'Normal'].includes(urgency)) fail(400, 'Choose a valid urgency.');
  const technicianId = req.user.role === 'TECHNICIAN' ? req.user._id : ticket.assignedTechnicianId;
  if (!technicianId) fail(409, 'Assign a technician before requesting parts.');
  const request = await ItemRequest.create({ ticketId: ticket._id, technicianId, itemId: item._id, quantityRequested, urgency });
  const stores = await User.find({ role: 'STORE_KEEPER', isActive: { $ne: false } }).distinct('_id');
  await notify(stores, ticket, `Parts requested for ${ticket.ticketNo}`, `${quantityRequested} ${item.unit} of ${item.name} requested.`, 'Inventory');
  await audit(req.user, 'REQUEST_PARTS', 'Inventory', ticket.ticketNo, `${quantityRequested} × ${item.name}`);
  res.status(201).json({ success: true, data: publicPart(await populatePart(ItemRequest.findById(request._id))) });
};
exports.issueRequest = async (req, res) => {
  const request = await ItemRequest.findOneAndUpdate({ _id: objectId(req.params.id, 'Parts request'), status: { $in: ['PENDING', 'ISSUING'] } }, { $set: { status: 'ISSUING' } }, { new: true });
  if (!request) fail(409, 'This parts request has already been processed.');
  let item = await InventoryItem.findOneAndUpdate({ _id: request.itemId, quantityAvailable: { $gte: request.quantityRequested }, issuedRequests: { $ne: request._id } }, { $inc: { quantityAvailable: -request.quantityRequested }, $addToSet: { issuedRequests: request._id } }, { new: true });
  if (!item) {
    item = await InventoryItem.findOne({ _id: request.itemId, issuedRequests: request._id });
    if (!item) {
      await ItemRequest.updateOne({ _id: request._id, status: 'ISSUING' }, { $set: { status: 'PENDING' } });
      fail(409, 'Not enough stock is available. Request stock or reduce the requested quantity.');
    }
  }
  const ticket = await Request.findById(request.ticketId);
  const technician = await User.findById(request.technicianId);
  await Transaction.updateOne({ reference: `issue:${request._id}` }, { $setOnInsert: { type: 'Issue', itemCode: item.code, itemName: item.name, quantity: request.quantityRequested, issuedTo: technician?.name || '', ticketRef: ticket.ticketNo, authorizedBy: req.user.name } }, { upsert: true });
  await ItemRequest.updateOne({ _id: request._id, status: 'ISSUING' }, { $set: { status: 'ISSUED' } });
  await notify([request.technicianId, ticket.supervisorId], ticket, `Parts issued for ${ticket.ticketNo}`, `${request.quantityRequested} ${item.unit} of ${item.name} are ready.`, 'Inventory');
  res.json({ success: true, data: publicPart(await populatePart(ItemRequest.findById(request._id))) });
};
exports.rejectRequest = async (req, res) => {
  const request = await ItemRequest.findOneAndUpdate({ _id: objectId(req.params.id, 'Parts request'), status: 'PENDING' }, { $set: { status: 'REJECTED', rejectionReason: text(req.body.reason || 'Item unavailable', 'Reason', 1000) } }, { new: true });
  if (!request) fail(409, 'This request has already been processed.');
  res.json({ success: true, data: publicPart(await populatePart(ItemRequest.findById(request._id))) });
};
exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(500);
  res.json({ success: true, data: transactions.map((item) => ({ id: idOf(item), timestamp: displayTime(item.createdAt), type: item.type, itemCode: item.itemCode, itemName: item.itemName, quantity: item.quantity, issuedTo: item.issuedTo, ticketRef: item.ticketRef, authorizedBy: item.authorizedBy })) });
};
exports.adjustStock = async (req, res) => {
  const delta = integer(req.body.delta, 'Stock change', -100000, 100000);
  const filter = { _id: objectId(req.params.id, 'Item') };
  if (delta < 0) filter.quantityAvailable = { $gte: -delta };
  const item = await InventoryItem.findOneAndUpdate(filter, { $inc: { quantityAvailable: delta } }, { new: true, runValidators: true });
  if (!item) fail(409, 'Item not found or this adjustment would make stock negative.');
  await Transaction.create({ reference: `adjust:${randomUUID()}`, type: 'Stock adjustment', itemCode: item.code, itemName: item.name, quantity: delta, issuedTo: 'Central Stores', ticketRef: 'Stock count', authorizedBy: `${req.user.name}: ${text(req.body.reason || 'Stock verification', 'Reason', 1000)}` });
  res.json({ success: true, data: publicItem(item) });
};
exports.purchaseRequest = async (req, res) => {
  const item = await InventoryItem.findOne({ code: text(req.body.itemCode, 'Item code', 100) });
  if (!item) fail(404, 'Stock item not found.');
  const quantity = integer(req.body.quantity, 'Quantity', 1, 500);
  const transaction = await Transaction.create({ reference: `PO-${randomUUID().slice(0, 8)}`, type: 'Purchase request', itemCode: item.code, itemName: item.name, quantity, issuedTo: 'Central Stores', ticketRef: 'Restocking', authorizedBy: `${req.user.name}: ${req.body.urgency || 'Normal'}` });
  res.status(201).json({ success: true, data: { id: idOf(transaction) } });
};
exports.upsertInventoryItem = async (req, res) => {
  const data = { name: text(req.body.name, 'Item name', 200), code: text(req.body.code, 'Item code', 100), quantityAvailable: integer(req.body.quantityAvailable, 'Stock', 0, 1000000), reorderLevel: integer(req.body.reorderLevel ?? 5, 'Reorder level', 0, 1000000), category: text(req.body.category || 'General', 'Category', 100), unit: text(req.body.unit || 'pcs', 'Unit', 40) };
  const item = req.body.id ? await InventoryItem.findByIdAndUpdate(objectId(req.body.id), { $set: data }, { new: true, runValidators: true }) : await InventoryItem.create(data);
  if (!item) fail(404, 'Stock item not found.');
  res.json({ success: true, data: publicItem(item) });
};
