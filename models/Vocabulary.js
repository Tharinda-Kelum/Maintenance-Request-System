const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
  word: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String },
});

vocabularySchema.index({ word: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Vocabulary', vocabularySchema);
