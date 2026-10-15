const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  stage: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Remark', remarkSchema);