const { randomUUID } = require('node:crypto');
const InventoryItem = require('../models/InventoryItem');
const ItemRequest = require('../models/ItemRequest');
const PurchaseRequest = require('../models/PurchaseRequest');
const Transaction = require('../models/InventoryTransaction');
const Notification = require('../models/Notification');
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
const populatePart = (query) => query.populate('ticketId', 'ticketNo room supervisorId').populate('technicianId', 'name trade').populate('itemId').populate('purchaseRequestId', 'status');
const publicPart = (request) => ({
  id: idOf(request), ticketId: request.ticketId?.ticketNo,
  technician: request.technicianId?.name, technicianTrade: request.technicianId?.trade || 'Technician',
  itemId: idOf(request.itemId), itemCode: request.itemId?.code || '', itemName: request.itemId?.name || 'Item',
  quantity: request.quantityRequested, unit: request.itemId?.unit || 'pcs',
  urgency: request.urgency || 'Normal', requestedAt: displayTime(request.createdAt),
  status: ({ PENDING: 'Pending', ISSUING: 'Issuing', PURCHASE_REQUESTED: 'Sent to Finance', ISSUED: 'Issued', REJECTED: 'Rejected' })[request.status],
  purchaseRequestId: idOf(request.purchaseRequestId), purchaseStatus: request.purchaseRequestId?.status || null,
  notes: request.rejectionReason || request.ticketId?.room || ''
});
const getFinanceContacts = () => User.find({ role: 'FINANCE_HEAD', isActive: { $ne: false } }).select('name email phone').sort({ name: 1 });
const publicPurchaseRequest = (request, financeContacts = []) => ({
  id: idOf(request), itemRequestId: idOf(request.itemRequestId), ticketId: request.ticketId?.ticketNo || null,
  item: request.itemId ? { id: idOf(request.itemId), code: request.itemId.code, name: request.itemId.name, unit: request.itemId.unit } : null,
  quantity: request.quantityToPurchase, status: request.status, remarks: request.remarks || '',
  requestedBy: request.requestedBy ? { id: idOf(request.requestedBy), name: request.requestedBy.name, email: request.requestedBy.email } : null,
  approvedBy: request.approvedBy?.name || null, requestedAt: displayTime(request.createdAt),
  approvedAt: displayTime(request.approvedAt), receivedAt: displayTime(request.receivedAt),
  financeContacts: financeContacts.map((contact) => ({ name: contact.name, email: contact.email, phone: contact.phone || '' }))
});
exports.getInventoryItems = async (req, res) => res.json({ success: true, data: (await InventoryItem.find().sort({ name: 1 })).map(publicItem) });
exports.getRequests = async (req, res) => {
  let filter = {};
  if (req.user.role === 'TECHNICIAN') filter = { technicianId: req.user._id };
  if (req.user.role === 'SUPERVISOR') filter = { ticketId: { $in: await Request.find(await ticketScope(req.user)).distinct('_id') } };
  if (req.user.role === 'FINANCE_HEAD') filter = { status: 'PURCHASE_REQUESTED' };
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
      item = await InventoryItem.findOneAndUpdate(
        { _id: request.itemId, quantityAvailable: { $gte: request.quantityRequested }, issuedRequests: { $ne: request._id } },
        { $inc: { quantityAvailable: -request.quantityRequested }, $addToSet: { issuedRequests: request._id } },
        { new: true }
      );
    }
    if (!item) {
      const stockItem = await InventoryItem.findById(request.itemId);
      if (!stockItem) {
        await ItemRequest.updateOne({ _id: request._id, status: 'ISSUING' }, { $set: { status: 'PENDING' } });
        fail(404, 'Stock item not found.');
      }
      const financeContacts = await getFinanceContacts();
      if (!financeContacts.length) {
        await ItemRequest.updateOne({ _id: request._id, status: 'ISSUING' }, { $set: { status: 'PENDING' } });
        fail(409, 'No active Head of Finance account is configured. Contact an administrator before routing this request.');
      }
      let purchaseRequest = await PurchaseRequest.findOne({ itemRequestId: request._id });
      if (!purchaseRequest) {
        try {
          purchaseRequest = await PurchaseRequest.create({
            itemId: stockItem._id, itemRequestId: request._id, ticketId: request.ticketId,
            requestedBy: req.user._id, quantityToPurchase: request.quantityRequested,
            remarks: `Stock request for ${request.quantityRequested} ${stockItem.unit} of ${stockItem.name} cannot be issued from available inventory.`
          });
        } catch (error) {
          if (error.code !== 11000) throw error;
          purchaseRequest = await PurchaseRequest.findOne({ itemRequestId: request._id });
          if (!purchaseRequest) throw error;
        }
      }
      const transition = await ItemRequest.updateOne(
        { _id: request._id, status: 'ISSUING' },
        { $set: { status: 'PURCHASE_REQUESTED', purchaseRequestId: purchaseRequest._id } }
      );
      if (transition.modifiedCount) {
        const financeNames = financeContacts.map((contact) => `${contact.name} (${contact.email}${contact.phone ? `, ${contact.phone}` : ''})`).join(', ');
        const statusNote = `SR for ${request.quantityRequested} ${stockItem.unit} of ${stockItem.name} could not be issued. PR ${purchaseRequest._id} was sent to the Finance branch for approval. Finance contact: ${financeNames}.`;
        const ticket = await Request.findById(request.ticketId);
        if (!ticket) fail(404, 'The maintenance request for this stock request no longer exists.');
        await Request.updateOne(
          { _id: ticket._id },
          { $push: { timeline: { status: 'PURCHASE_REQUESTED', actor: req.user.name, actorId: req.user._id, note: statusNote } } }
        );
        await notify(financeContacts.map((contact) => contact._id), ticket, `Purchase approval required for ${ticket.ticketNo}`, statusNote, 'Purchase Requests');
        await audit(req.user, 'CREATE_PURCHASE_REQUEST', 'Inventory', ticket.ticketNo, statusNote);
      }
      res.status(201).json({ success: true, data: publicPart(await populatePart(ItemRequest.findById(request._id))) });
      return;
    }
  }
  const ticket = await Request.findById(request.ticketId);
  if (!ticket) fail(404, 'The maintenance request for this stock request no longer exists.');
  const technician = await User.findById(request.technicianId);
  await Transaction.updateOne({ reference: `issue:${request._id}` }, { $setOnInsert: { type: 'Issue', itemCode: item.code, itemName: item.name, quantity: request.quantityRequested, issuedTo: technician?.name || '', ticketRef: ticket.ticketNo, authorizedBy: req.user.name } }, { upsert: true });
  const issuance = await ItemRequest.updateOne({ _id: request._id, status: 'ISSUING' }, { $set: { status: 'ISSUED' } });
  if (issuance.modifiedCount && request.purchaseRequestId) {
    const purchaseRequest = await PurchaseRequest.findById(request.purchaseRequestId).populate('approvedBy', 'name email phone');
    const financeContact = purchaseRequest?.approvedBy ? ` Finance contact: ${purchaseRequest.approvedBy.name} (${purchaseRequest.approvedBy.email}${purchaseRequest.approvedBy.phone ? `, ${purchaseRequest.approvedBy.phone}` : ''}).` : '';
    await Request.updateOne(
      { _id: ticket._id },
      { $push: { timeline: { status: 'PARTS_ISSUED', actor: req.user.name, actorId: req.user._id, note: `SR for ${request.quantityRequested} ${item.unit} of ${item.name} was issued after PR approval.${financeContact}` } } }
    );
  }
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
  const purchaseRequest = await PurchaseRequest.create({
    itemId: item._id, requestedBy: req.user._id, quantityToPurchase: quantity,
    remarks: text(req.body.remarks || `${req.user.name} requested ${quantity} ${item.unit} of ${item.name} for restocking.`, 'Remarks', 1000)
  });
  const financeContacts = await getFinanceContacts();
  if (financeContacts.length) {
    await Notification.insertMany(financeContacts.map((contact) => ({
      userId: contact._id, title: 'Purchase approval required',
      message: `PR ${idOf(purchaseRequest)} requests ${quantity} ${item.unit} of ${item.name}.`,
      category: 'Purchase Requests'
    })));
  }
  await audit(req.user, 'CREATE_PURCHASE_REQUEST', 'Inventory', purchaseRequest._id, `${quantity} × ${item.name}`);
  res.status(201).json({ success: true, data: publicPurchaseRequest(purchaseRequest, financeContacts) });
};
exports.getPurchaseRequests = async (req, res) => {
  const requests = await PurchaseRequest.find().populate('itemId').populate('ticketId', 'ticketNo').populate('requestedBy', 'name email').populate('approvedBy', 'name').sort({ createdAt: -1 });
  res.json({ success: true, data: requests.map((request) => publicPurchaseRequest(request, [])) });
};
exports.approvePurchaseRequest = async (req, res) => {
  const remarks = text(req.body.remarks || '', 'Remarks', 1000, false);
  const request = await PurchaseRequest.findOneAndUpdate(
    { _id: objectId(req.params.id, 'Purchase request'), status: 'PENDING' },
    { $set: { status: 'APPROVED', approvedBy: req.user._id, approvedAt: new Date(), remarks } },
    { new: true }
  ).populate('itemId').populate('ticketId', 'ticketNo').populate('requestedBy', 'name email').populate('approvedBy', 'name email phone');
  if (!request) fail(409, 'This purchase request has already been reviewed or does not exist.');
  await audit(req.user, 'APPROVE_PURCHASE_REQUEST', 'Inventory', request._id, remarks);
  const itemRequest = request.itemRequestId ? await ItemRequest.findById(request.itemRequestId) : null;
  const approvedMessage = `${request.quantityToPurchase} ${request.itemId.unit} of ${request.itemId.name} was approved by the Head of Finance. Finance contact: ${request.approvedBy.name} (${request.approvedBy.email}${request.approvedBy.phone ? `, ${request.approvedBy.phone}` : ''}).`;
  if (request.ticketId) {
    await Request.updateOne({ _id: request.ticketId._id }, { $push: { timeline: { status: 'PURCHASE_APPROVED', actor: req.user.name, actorId: req.user._id, note: approvedMessage } } });
    if (itemRequest) await notify([itemRequest.technicianId, request.requestedBy._id], request.ticketId, `Purchase request approved for ${request.ticketId.ticketNo}`, approvedMessage, 'Purchase Requests');
  } else {
    await Notification.create({ userId: request.requestedBy._id, title: 'Purchase request approved', message: approvedMessage, category: 'Purchase Requests' });
  }
  res.json({ success: true, data: publicPurchaseRequest(request) });
};
exports.rejectPurchaseRequest = async (req, res) => {
  const remarks = text(req.body.remarks, 'Reason for rejection', 1000);
  const request = await PurchaseRequest.findOneAndUpdate(
    { _id: objectId(req.params.id, 'Purchase request'), status: 'PENDING' },
    { $set: { status: 'REJECTED', rejectedBy: req.user._id, rejectedAt: new Date(), remarks } },
    { new: true }
  ).populate('itemId').populate('ticketId', 'ticketNo').populate('requestedBy', 'name email');
  if (!request) fail(409, 'This purchase request has already been reviewed or does not exist.');
  if (request.itemRequestId) {
    await ItemRequest.updateOne(
      { _id: request.itemRequestId, status: 'PURCHASE_REQUESTED' },
      { $set: { status: 'REJECTED', rejectionReason: remarks } }
    );
  }
  await audit(req.user, 'REJECT_PURCHASE_REQUEST', 'Inventory', request._id, remarks);
  if (request.ticketId) {
    await Request.updateOne({ _id: request.ticketId._id }, { $push: { timeline: { status: 'PURCHASE_REJECTED', actor: req.user.name, actorId: req.user._id, note: `Finance rejected purchase request ${idOf(request)}: ${remarks}. Finance contact: ${req.user.name} (${req.user.email}${req.user.phone ? `, ${req.user.phone}` : ''}).` } } });
    if (request.itemRequestId) {
      const itemRequest = await ItemRequest.findById(request.itemRequestId);
      if (itemRequest) await notify([itemRequest.technicianId, request.requestedBy._id], request.ticketId, `Purchase request rejected for ${request.ticketId.ticketNo}`, remarks, 'Purchase Requests');
    }
  } else {
    await Notification.create({ userId: request.requestedBy._id, title: 'Purchase request rejected', message: remarks, category: 'Purchase Requests' });
  }
  res.json({ success: true, data: publicPurchaseRequest(request) });
};
exports.receivePurchaseRequest = async (req, res) => {
  const id = objectId(req.params.id, 'Purchase request');
  const request = await PurchaseRequest.findById(id).populate('itemId').populate('ticketId', 'ticketNo supervisorId').populate('approvedBy', 'name email phone');
  if (!request) fail(404, 'Purchase request not found.');
  if (!['APPROVED', 'PURCHASED'].includes(request.status)) fail(409, 'Finance must approve this purchase request before stock can be received.');
  const item = await InventoryItem.findOneAndUpdate(
    { _id: request.itemId._id, receivedPurchases: { $ne: request._id } },
    { $inc: { quantityAvailable: request.quantityToPurchase }, $addToSet: { receivedPurchases: request._id } },
    { new: true }
  );
  const receivedItem = item || await InventoryItem.findById(request.itemId._id);
  if (!receivedItem) fail(404, 'The inventory item for this purchase request no longer exists.');
  await Transaction.updateOne(
    { reference: `purchase:${request._id}` },
    { $setOnInsert: { type: 'Purchase received', itemCode: receivedItem.code, itemName: receivedItem.name, quantity: request.quantityToPurchase, issuedTo: 'Central Stores', ticketRef: request.ticketId?.ticketNo || 'Restocking', authorizedBy: req.user.name } },
    { upsert: true }
  );
  request.status = 'PURCHASED';
  request.receivedBy = req.user._id;
  request.receivedAt = request.receivedAt || new Date();
  await request.save();
  if (request.itemRequestId) {
    await ItemRequest.updateOne(
      { _id: request.itemRequestId, status: 'PURCHASE_REQUESTED' },
      { $set: { status: 'PENDING' } }
    );
  }
  await audit(req.user, 'RECEIVE_PURCHASE_REQUEST', 'Inventory', request._id, `${request.quantityToPurchase} × ${receivedItem.name} added to stock.`);
  if (request.ticketId) {
    const itemRequest = await ItemRequest.findById(request.itemRequestId);
    const financeContact = request.approvedBy ? ` Finance contact: ${request.approvedBy.name} (${request.approvedBy.email}${request.approvedBy.phone ? `, ${request.approvedBy.phone}` : ''}).` : '';
    await Request.updateOne({ _id: request.ticketId._id }, { $push: { timeline: { status: 'PURCHASE_RECEIVED', actor: req.user.name, actorId: req.user._id, note: `${request.quantityToPurchase} ${receivedItem.unit} of ${receivedItem.name} was received. The SR is ready for Store Keeper issue.${financeContact}` } } });
    if (itemRequest) await notify([itemRequest.technicianId, request.ticketId.supervisorId], `Stock received for ${request.ticketId.ticketNo}`, `The Store Keeper can now issue ${request.quantityToPurchase} ${receivedItem.unit} of ${receivedItem.name}.`, 'Purchase Requests');
  }
  await request.populate('requestedBy', 'name email');
  await request.populate('approvedBy', 'name');
  res.json({ success: true, data: publicPurchaseRequest(request) });
};
exports.upsertInventoryItem = async (req, res) => {
  const data = { name: text(req.body.name, 'Item name', 200), code: text(req.body.code, 'Item code', 100), quantityAvailable: integer(req.body.quantityAvailable, 'Stock', 0, 1000000), reorderLevel: integer(req.body.reorderLevel ?? 5, 'Reorder level', 0, 1000000), category: text(req.body.category || 'General', 'Category', 100), unit: text(req.body.unit || 'pcs', 'Unit', 40) };
  const item = req.body.id ? await InventoryItem.findByIdAndUpdate(objectId(req.body.id), { $set: data }, { new: true, runValidators: true }) : await InventoryItem.create(data);
  if (!item) fail(404, 'Stock item not found.');
  res.json({ success: true, data: publicItem(item) });
};
