const mongoose = require('mongoose');
module.exports = mongoose.model('PortalConfig', new mongoose.Schema({
  _id: String, value: mongoose.Schema.Types.Mixed
}, { timestamps: true }));
