export const WORKFLOW_STEPS = [
  'Staff request', 'HOD approval', 'Dean approval', 'Maintenance review',
  'Technician assignment', 'Inspection', 'Supervisor arrangements', 'Technician work', 'Supervisor check & rating', 'Completed'
];
export const workflowStage = (status) => ({
  SUBMITTED: 1, HOD_REJECTED: 1, HOD_APPROVED: 2, DEAN_REJECTED: 2,
  DEAN_APPROVED: 3, FORWARDED_TO_SUPERVISOR: 4, TECHNICIAN_ASSIGNED: 5,
  INSPECTION_COMPLETED: 6, ARRANGEMENTS_IN_PROGRESS: 7, TECHNICIAN_COMPLETED: 8, COMPLETED: 9
}[status] ?? 0);

export const actionForTicket = (ticket, role) => {
  if (role === 'dept_admin' && ticket.workflowStatus === 'SUBMITTED') return { action: 'hodReview', label: 'Review request', kind: 'review', title: 'HOD review' };
  if (role === 'dean' && ticket.workflowStatus === 'HOD_APPROVED') return { action: 'deanReview', label: 'Review request', kind: 'review', title: 'Dean review' };
  if (role === 'maintenance_head' && ticket.workflowStatus === 'DEAN_APPROVED') return { action: 'forward', label: 'Choose supervisor', kind: 'supervisor', title: 'Forward to a supervisor' };
  if (role === 'supervisor' && ticket.workflowStatus === 'FORWARDED_TO_SUPERVISOR') return { action: 'assign', label: 'Assign technician', kind: 'technician', title: 'Arrange the inspection' };
  if (role === 'technician' && ticket.workflowStatus === 'TECHNICIAN_ASSIGNED') return { action: 'inspection', label: 'Inspect & report', kind: 'inspection', title: 'Inspection report' };
  if (role === 'supervisor' && ticket.workflowStatus === 'INSPECTION_COMPLETED') return { action: 'arrangements', label: 'Send materials to technician', kind: 'arrangements', title: 'Confirm materials for the technician', isCompleted: false };
  if (role === 'technician' && ticket.workflowStatus === 'ARRANGEMENTS_IN_PROGRESS') return { action: 'completionReport', label: 'Complete work & report', kind: 'work', title: 'Work completion report' };
  if (role === 'supervisor' && ticket.workflowStatus === 'TECHNICIAN_COMPLETED') return { action: 'supervisorReview', label: 'Check & rate work', kind: 'verification', title: 'Check and rate the completed work' };
  return null;
};
export const opensWorkspace = (action) => ['inspection', 'work'].includes(action?.kind);
