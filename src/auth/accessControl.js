export const ROLE_HOME = {
  general_user: 'staff_dashboard',
  dept_admin: 'dashboard',
  technician: 'technician_dashboard',
  store_keeper: 'inventory_dashboard',
  super_admin: 'superadmin_dashboard'
};

const SHARED_TABS = ['notifications', 'profile'];

export const ROLE_PERMISSIONS = {
  general_user: [
    'staff_dashboard',
    'my_requests',
    'requests',
    'create_request',
    'request_detail',
    'campus_info',
    ...SHARED_TABS
  ],
  dept_admin: [
    'dashboard',
    'review_queue',
    'requests',
    'request_detail',
    'technicians',
    'reports',
    'locations',
    ...SHARED_TABS
  ],
  technician: [
    'technician_dashboard',
    'field_workspace',
    'parts_request',
    'requests',
    'request_detail',
    ...SHARED_TABS
  ],
  store_keeper: [
    'inventory_dashboard',
    'inventory_items',
    'item_requests',
    'transactions',
    'requests',
    'request_detail',
    ...SHARED_TABS
  ],
  super_admin: [
    'superadmin_dashboard',
    'requests',
    'request_detail',
    'reports',
    'inventory_dashboard',
    'inventory_items',
    'item_requests',
    'transactions',
    'users',
    'permissions',
    'locations',
    'campus_info',
    'categories',
    'workflow',
    'audit_logs',
    'settings',
    ...SHARED_TABS
  ]
};

export const getRoleHome = (roleId) => ROLE_HOME[roleId] || ROLE_HOME.general_user;

export const canAccessTab = (roleId, tabId) =>
  Boolean(roleId && ROLE_PERMISSIONS[roleId]?.includes(tabId));
