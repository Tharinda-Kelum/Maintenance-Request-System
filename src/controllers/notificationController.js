const Notification = require('../models/Notification');
const { displayTime } = require('../services/portalService');
const { objectId, fail } = require('../utils/http');

exports.getUserNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).populate('ticketId', 'ticketNo').sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, data: notifications.map((item) => ({ id: String(item._id), title: item.title, message: item.message, category: item.category, timestamp: displayTime(item.createdAt), ticketId: item.ticketId?.ticketNo || null, unread: !item.isRead })) });
};
exports.markAllAsRead = async (req, res) => { await Notification.updateMany({ userId: req.user._id, isRead: false }, { $set: { isRead: true } }); res.json({ success: true }); };
exports.markAsRead = async (req, res) => {
  const id = objectId(req.params.id, 'Notification');
  if (req.body.isRead !== undefined && typeof req.body.isRead !== 'boolean') fail(400, 'Read status must be true or false.');
  const notification = await Notification.findOneAndUpdate({ _id: id, userId: req.user._id }, { $set: { isRead: req.body.isRead ?? true } });
  if (!notification) fail(404, 'Notification not found.');
  res.json({ success: true });
};
