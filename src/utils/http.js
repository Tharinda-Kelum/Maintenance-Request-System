const mongoose = require('mongoose');
exports.fail = (status, message) => { const error = new Error(message); error.status = status; throw error; };
exports.text = (value, label, max = 5000, required = true) => {
  if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) exports.fail(400, `${label} is required and must be no longer than ${max} characters.`);
  return value.trim();
};
exports.objectId = (value, label = 'Record') => {
  if (!mongoose.isValidObjectId(value)) exports.fail(400, `${label} ID is invalid.`);
  return value;
};
exports.integer = (value, label, min = 1, max = 500) => {
  if (!Number.isInteger(value) || value < min || value > max) exports.fail(400, `${label} must be a whole number from ${min} to ${max}.`);
  return value;
};
