const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', default: null },
  title: { type: String, default: 'Maintenance update' },
  category: { type: String, default: 'Requests' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Notification', schema);
