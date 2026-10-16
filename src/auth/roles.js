export const ROLE_CONFIGS = {
  general_user: { label: 'Staff member', description: 'Reports problems and follows the approval and maintenance progress.' },
  dept_admin: { label: 'Head of Department', description: 'Reviews requests from staff in their department before Dean approval.' },
  dean: { label: 'Dean', description: 'Reviews HOD-approved requests for their faculty.' },
  maintenance_head: { label: 'Head of Maintenance', description: 'Forwards approved requests to a maintenance supervisor.' },
  supervisor: { label: 'Maintenance Supervisor', description: 'Arranges work, checks completion reports, and rates the completed work.' },
  technician: { label: 'Technician', description: 'Inspects problems, completes assigned work, and reports actual time and material usage.' },
  store_keeper: { label: 'Store Keeper', description: 'Manages stock and issues the requested maintenance materials.' },
  super_admin: { label: 'System Administrator', description: 'Manages accounts, campus information, settings, and audit records.' }
};

export const BACKEND_ROLES = {
  general_user: 'STAFF', dept_admin: 'HOD', dean: 'DEAN', maintenance_head: 'HEAD_OF_MAINTENANCE',
  supervisor: 'SUPERVISOR', technician: 'TECHNICIAN', store_keeper: 'STORE_KEEPER', super_admin: 'SUPER_ADMIN'
};
