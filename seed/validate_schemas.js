const mongoose = require('mongoose');
const { User, Staff, StaffType, Department, State, Request, Inventory, Item, Notification, Vocabulary } = require('../models');

const oid = () => new mongoose.Types.ObjectId();

function check(name, doc) {
  const err = doc.validateSync();
  if (err) {
    console.error(`FAIL [${name}]:`, err.message);
    process.exitCode = 1;
  } else {
    console.log(`OK   [${name}]`);
  }
}

check('User', new User({ username: 'test', password: 'hashed' }));
check('StaffType', new StaffType({ type: 'technician', description: 'fixes things' }));
check('Department', new Department({ department_name: 'Test Dept' }));
check('State', new State({ description: 'high priority' }));
check('Item', new Item({ item_name: 'Bolt', unit_cost: 5 }));

check('Staff', new Staff({
  user_id: oid(), type_id: oid(), department_id: oid(), name: 'Test', email: 'hashed@x',
}));

check('Inventory (central)', new Inventory({
  item_id: oid(), department_id: null, quantity_available: 10,
}));
check('Inventory (dept)', new Inventory({
  item_id: oid(), department_id: oid(), quantity_available: 5,
  distribution_log: [{ department_id: oid(), quantity: 2, distributed_by: oid() }],
}));

check('Notification', new Notification({
  request_id: oid(), recipient_id: oid(), message: 'hi', type_id: oid(),
}));

check('Vocabulary', new Vocabulary({ word: 'SLA', description: 'deadline', type: 'system' }));

check('Request (full, with embedded arrays)', new Request({
  originator: oid(),
  priority_id: oid(),
  job: 'Fix the AC',
  current_handler: oid(),
  report: { technician_id: oid(), diagnosis: 'capacitor dead', items_needed: [{ item_id: oid(), item_name: 'cap', qty: 1, available_in_store: false }] },
  purchase_requests: [{ items: [{ item_name: 'cap', qty: 1, estimated_cost: 100 }], status_id: oid(), requested_by: oid() }],
  stock_requests: [{ items: [{ item_id: oid(), qty: 2 }], status_id: oid(), requested_by: oid() }],
  inspections: [{ inspector_id: oid(), inspection_level_id: oid(), result_id: oid(), remarks: 'ok' }],
  attachments: [{ file_name: 'photo.jpg', file_path: '/uploads/photo.jpg', uploaded_by: oid() }],
}));

// Negative test: missing required field should fail validation
const bad = new User({ username: 'nopassword' });
const badErr = bad.validateSync();
if (badErr) {
  console.log('OK   [User missing password correctly rejected]');
} else {
  console.error('FAIL [User missing password should have been rejected]');
  process.exitCode = 1;
}

if (process.exitCode === 1) {
  console.log('\nSOME CHECKS FAILED');
} else {
  console.log('\nALL SCHEMA CHECKS PASSED');
}
