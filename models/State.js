const mongoose = require('mongoose');

// Generic status/priority lookup. Used for request.priority_id, PR/SR status,
// inspection level/result, and notification type — all share this one collection.
const stateSchema = new mongoose.Schema({
  description: { type: String, required: true },
});

module.exports = mongoose.model('State', stateSchema);
