require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const {
  User, Staff, StaffType, Department, State, Request, Inventory, Item, Notification, Vocabulary,
} = require('../models');

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}), Staff.deleteMany({}), StaffType.deleteMany({}),
    Department.deleteMany({}), State.deleteMany({}), Request.deleteMany({}),
    Inventory.deleteMany({}), Item.deleteMany({}), Notification.deleteMany({}),
    Vocabulary.deleteMany({}),
  ]);

  console.log('Seeding staff types...');
  const staffTypes = await StaffType.insertMany([
    { type: 'staff', description: 'Regular staff member who can raise requests' },
    { type: 'hod', description: 'Head of Department' },
    { type: 'dean', description: 'Dean of Faculty' },
    { type: 'technician', description: 'Diagnoses and fixes issues' },
    { type: 'supervisor', description: 'First-level maintenance sign-off' },
    { type: 'authority', description: 'Approves purchase requests, final sign-off' },
    { type: 'head', description: 'Head of Maintenance Department' },
  ]);
  const typeByName = Object.fromEntries(staffTypes.map(t => [t.type, t._id]));

  console.log('Seeding states (priority / status lookup)...');
  const states = await State.insertMany([
    { description: 'low priority' }, { description: 'medium priority' },
    { description: 'high priority' }, { description: 'urgent priority' },
    { description: 'pending' }, { description: 'approved' }, { description: 'rejected' },
    { description: 'issued' }, { description: 'supervisor' }, { description: 'authority' },
    { description: 'passed' }, { description: 'failed' }, { description: 'needs_rework' },
    { description: 'forwarded' }, { description: 'sla_breach' },
  ]);
  const stateByDesc = Object.fromEntries(states.map(s => [s.description, s._id]));

  console.log('Seeding departments (faculty -> department)...');
  const facultyEng = await Department.create({ department_name: 'Faculty of Engineering', parent_id: null });
  const deptCS = await Department.create({ department_name: 'Department of Computer Science', parent_id: facultyEng._id });
  const deptMaint = await Department.create({ department_name: 'Maintenance Department', parent_id: null });

  console.log('Seeding users + staff...');
  async function makeStaff(username, name, typeKey, departmentId) {
    const user = await User.create({ username, password: '$2b$10$examplehashedpassword' });
    const staff = await Staff.create({
      user_id: user._id,
      type_id: typeByName[typeKey],
      department_id: departmentId,
      name,
      email: `hashed-${username}@example.invalid`, // placeholder for a hashed email value
      phone: '+94-77-0000000',
    });
    return { user, staff };
  }

  const { user: lecturerUser, staff: lecturer } = await makeStaff('nimal.perera', 'Nimal Perera', 'staff', deptCS._id);
  const { staff: hod } = await makeStaff('sunil.fernando', 'Sunil Fernando', 'hod', deptCS._id);
  const { staff: dean } = await makeStaff('kamal.silva', 'Kamal Silva', 'dean', facultyEng._id);
  const { staff: technician } = await makeStaff('ravi.tech', 'Ravi Bandara', 'technician', deptMaint._id);
  const { staff: supervisor } = await makeStaff('anusha.super', 'Anusha Jayasuriya', 'supervisor', deptMaint._id);
  const { staff: authority } = await makeStaff('priya.auth', 'Priya Wickrama', 'authority', deptMaint._id);

  // Link department heads now that staff exist
  deptCS.head_id = hod._id; await deptCS.save();
  facultyEng.head_id = dean._id; await facultyEng.save();

  console.log('Seeding items + inventory (central + department)...');
  const capacitor = await Item.create({ item_name: 'AC Capacitor 35uF', category: 'Electrical', unit: 'pcs', unit_cost: 4500 });
  const cable = await Item.create({ item_name: 'LAN Cable Cat 6', category: 'IT', unit: 'meters', unit_cost: 120 });

  await Inventory.create({ item_id: capacitor._id, department_id: null, quantity_available: 35, minimum_threshold: 10 });
  await Inventory.create({ item_id: capacitor._id, department_id: deptCS._id, quantity_available: 1, minimum_threshold: 2 });
  await Inventory.create({ item_id: cable._id, department_id: null, quantity_available: 200, minimum_threshold: 50 });
  await Inventory.create({ item_id: cable._id, department_id: deptCS._id, quantity_available: 40, minimum_threshold: 20 });

  console.log('Seeding vocabulary...');
  await Vocabulary.insertMany([
    { word: 'SLA', description: 'Service Level Agreement — deadline by which an issue should be resolved', type: 'system' },
    { word: 'PR', description: 'Purchase Request — raised when a needed item is not in stock', type: 'maintenance' },
    { word: 'SR', description: 'Stock Request — raised when a needed item is already in stock', type: 'maintenance' },
  ]);

  console.log('Seeding a sample request (full workflow demo)...');
  const request = await Request.create({
    originator: lecturerUser._id,
    recipient: technician._id,
    priority_id: stateByDesc['high priority'],
    job: 'AC unit not cooling in Room 204',
    category: 'Electrical',
    location: 'Room 204, CS Building',
    escalation_path: { user: lecturerUser._id, hod: hod._id, dean: dean._id },
    current_handler: technician._id,
    remarks: 'Technician assigned, awaiting diagnosis',
    report: {
      technician_id: technician._id,
      diagnosis: 'Compressor capacitor failed',
      items_needed: [{ item_id: capacitor._id, item_name: 'AC Capacitor 35uF', qty: 1, available_in_store: false }],
      estimated_cost: 4500,
    },
    purchase_requests: [{
      items: [{ item_name: 'AC Capacitor 35uF', qty: 1, estimated_cost: 4500 }],
      status_id: stateByDesc['pending'],
      requested_by: technician._id,
    }],
  });

  await Notification.create({
    request_id: request._id,
    recipient_id: hod._id,
    message: `Request "${request.job}" forwarded to you`,
    type_id: stateByDesc['forwarded'],
  });

  console.log('Seed complete.');
  console.log(`Sample request _id: ${request._id}`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
