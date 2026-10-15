const Department = require('../models/Department');
const PortalConfig = require('../models/PortalConfig');
const AuditLog = require('../models/AuditLog');
const { settings, defaults, audit, displayTime } = require('../services/portalService');
const { fail, text, integer } = require('../utils/http');

exports.getSettings = async (req, res) => res.json({ success: true, data: await settings() });
exports.saveSettings = async (req, res) => {
  const current = await settings();
  const next = { ...current };
  for (const key of ['systemName', 'campusHours', 'supportEmail', 'supportExtension']) {
    if (req.body[key] !== undefined) next[key] = text(req.body[key], key, key === 'systemName' ? 60 : 250);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.supportEmail)) fail(400, 'Enter a valid support email.');
  if (req.body.responseHours !== undefined) {
    next.responseHours = {};
    for (const priority of Object.keys(defaults.responseHours)) next.responseHours[priority] = integer(req.body.responseHours[priority], `${priority} response target`, 1, 720);
  }
  await PortalConfig.findByIdAndUpdate('settings', { $set: { value: next } }, { upsert: true });
  await audit(req.user, 'SAVE_SETTINGS', 'Workflow Settings', 'Portal', 'Portal settings or response targets updated.');
  res.json({ success: true, data: next });
};
exports.getLocations = async (req, res) => res.json({ success: true, data: (await PortalConfig.findById('locations').lean())?.value || [] });
exports.addLocation = async (req, res) => {
  const details = {};
  for (const key of ['faculty', 'department', 'building', 'floor', 'room']) details[key] = text(req.body[key], key, 250);
  const config = await PortalConfig.findById('locations');
  const value = structuredClone(config?.value || []);
  let faculty = value.find((item) => item.faculty === details.faculty);
  if (!faculty) { faculty = { faculty: details.faculty, departments: [] }; value.push(faculty); }
  let department = faculty.departments.find((item) => item.name === details.department);
  if (!department) { department = { name: details.department, buildings: [] }; faculty.departments.push(department); }
  let building = department.buildings.find((item) => item.name === details.building);
  if (!building) { building = { name: details.building, floors: [] }; department.buildings.push(building); }
  let floor = building.floors.find((item) => item.floor === details.floor);
  if (!floor) { floor = { floor: details.floor, rooms: [] }; building.floors.push(floor); }
  if (!floor.rooms.includes(details.room)) floor.rooms.push(details.room);
  await PortalConfig.findByIdAndUpdate('locations', { $set: { value } }, { upsert: true });
  res.status(201).json({ success: true, data: value });
};
exports.getDepartments = async (req, res) => {
  const departments = await Department.find().populate('parentId', 'name').sort({ name: 1 });
  res.json({ success: true, data: departments.map((item) => ({ id: String(item._id), name: item.name, code: item.code, parentId: item.parentId ? String(item.parentId._id) : null, faculty: item.parentId?.name || item.name })) });
};
exports.getAuditLogs = async (req, res) => {
  const rows = await AuditLog.find().sort({ createdAt: -1 }).limit(1000);
  res.json({ success: true, data: rows.map((item) => ({ id: String(item._id), timestamp: displayTime(item.createdAt), user: item.user, userRole: item.userRole, action: item.action, module: item.module, target: item.target, details: item.details, ip: item.ip || '', device: '' })) });
};
