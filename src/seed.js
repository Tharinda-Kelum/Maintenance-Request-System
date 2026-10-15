require('dotenv').config({ path: require('node:path').join(__dirname, '../.env'), quiet: true });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { createHash } = require('node:crypto');
const Department = require('./models/Department');
const User = require('./models/User');
const InventoryItem = require('./models/InventoryItem');
const PortalConfig = require('./models/PortalConfig');
const fixture = require('./data/seedData.json');
const { defaults } = require('./services/portalService');

const departmentCode = (name) => `D-${createHash('sha256').update(name).digest('hex').slice(0, 10).toUpperCase()}`;
const ensureDepartment = (name, parentId = null) => Department.findOneAndUpdate({ name, parentId }, { $setOnInsert: { name, code: departmentCode(`${parentId || ''}:${name}`), parentId } }, { new: true, upsert: true });
const seed = async () => {
  for (const faculty of fixture.locations) {
    const parent = await ensureDepartment(faculty.faculty);
    for (const department of faculty.departments) await ensureDepartment(department.name, parent._id);
  }
  const faculty = await ensureDepartment('Faculty of Applied Science');
  const maintenance = await ensureDepartment('Main Maintenance Division');
  const existingHod = await User.findOne({ email: 'hod.cs@vau.ac.lk' });
  const department = existingHod ? await Department.findById(existingHod.departmentId) : await ensureDepartment('Department of Physical Science', faculty._id);
  const password = await bcrypt.hash(process.env.SEED_PASSWORD || 'Admin@1234', 12);
  const accounts = [
    ['user', 'Dr. K. Sivalingam', 'k.sivalingam@vau.ac.lk', 'STAFF', department._id, ''],
    ['deptadmin', 'Head of Department', 'hod.cs@vau.ac.lk', 'HOD', department._id, ''],
    ['dean', 'Faculty Dean', 'dean@vau.ac.lk', 'DEAN', faculty._id, ''],
    ['head', 'Head of Maintenance', 'head.maintenance@vau.ac.lk', 'HEAD_OF_MAINTENANCE', maintenance._id, ''],
    ['supervisor', 'Maintenance Supervisor', 'supervisor@vau.ac.lk', 'SUPERVISOR', maintenance._id, ''],
    ['technician', 'N. Pathmanathan', 'tech.electrical@vau.ac.lk', 'TECHNICIAN', maintenance._id, 'Electrical & HVAC'],
    ['storekeeper', 'M. Fernando', 'stores@vau.ac.lk', 'STORE_KEEPER', maintenance._id, ''],
    ['admin', 'System Administrator', 'admin.it@vau.ac.lk', 'SUPER_ADMIN', maintenance._id, '']
  ];
  for (const [username, name, email, role, departmentId, trade] of accounts) {
    const user = await User.findOneAndUpdate({ email }, { $setOnInsert: { username, name, email, role, departmentId, trade, password } }, { upsert: true, new: true });
    if (!user.username && !await User.exists({ username })) { user.username = username; await user.save(); }
    if (role === 'HOD') await Department.updateOne({ _id: user.departmentId, hodId: null }, { $set: { hodId: user._id } });
  }
  for (const item of fixture.inventory) await InventoryItem.updateOne({ name: item.name }, { $setOnInsert: { name: item.name, code: item.code, category: item.category, quantityAvailable: item.stock, unit: item.unit, unitCost: item.unitCost, reorderLevel: item.reorderLevel, location: item.location } }, { upsert: true });
  await PortalConfig.updateOne({ _id: 'settings' }, { $setOnInsert: { value: defaults } }, { upsert: true });
  await PortalConfig.updateOne({ _id: 'locations' }, { $setOnInsert: { value: fixture.locations } }, { upsert: true });
  console.log('Missing accounts, departments, campus locations, and stock items have been added. Existing data was preserved.');
};
module.exports = { seed };
if (require.main === module) mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maintenance_db', { serverSelectionTimeoutMS: 5000 }).then(seed).then(() => mongoose.disconnect()).catch((error) => { console.error('Seed failed:', error.message); process.exitCode = 1; mongoose.disconnect(); });
