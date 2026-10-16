export const ROLE_HOME = {
  general_user: 'staff_dashboard', dept_admin: 'workflow_dashboard', dean: 'workflow_dashboard',
  maintenance_head: 'workflow_dashboard', supervisor: 'workflow_dashboard', technician: 'technician_dashboard',
  store_keeper: 'inventory_dashboard', super_admin: 'superadmin_dashboard'
};
const shared = ['requests', 'request_detail', 'notifications', 'profile', 'campus_info'];
const inventory = ['inventory_dashboard', 'inventory_items', 'item_requests', 'transactions'];
export const ROLE_PERMISSIONS = {
  general_user: [...shared, 'staff_dashboard', 'my_requests', 'create_request'],
  dept_admin: [...shared, 'workflow_dashboard', 'dashboard', 'review_queue', 'technicians', 'reports', 'locations', 'users'],
  dean: [...shared, 'workflow_dashboard', 'reports', 'users', 'locations'],
  maintenance_head: [...shared, ...inventory, 'workflow_dashboard', 'technicians', 'reports', 'users', 'locations'],
  supervisor: [...shared, 'workflow_dashboard', 'technicians', 'parts_request', 'reports', 'users'],
  technician: [...shared, 'technician_dashboard', 'field_workspace', 'parts_request'],
  store_keeper: [...shared, ...inventory],
  super_admin: [...shared, ...inventory, 'superadmin_dashboard', 'reports', 'users', 'permissions', 'locations', 'categories', 'workflow', 'audit_logs', 'settings']
};
export const getRoleHome = (roleId) => ROLE_HOME[roleId] || 'staff_dashboard';
export const canAccessTab = (roleId, tabId) => Boolean(roleId && ROLE_PERMISSIONS[roleId]?.includes(tabId));
