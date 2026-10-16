export const isOwnRequest = (ticket, user) => ticket.requester?.id === user?.id || ticket.requester?.email === user?.email;
export const requestGroup = (status) => {
  if (['Completed', 'Resolved', 'COMPLETED'].includes(status)) return 'Completed';
  if (['Awaiting supervisor verification', 'TECHNICIAN_COMPLETED'].includes(status)) return 'In progress';
  if (status?.includes('Rejected') || status?.includes('REJECTED')) return 'Rejected';
  if (status?.startsWith('Awaiting') || ['SUBMITTED', 'HOD_APPROVED', 'DEAN_APPROVED', 'FORWARDED_TO_SUPERVISOR', 'Submitted', 'Pending Review', 'Approved'].includes(status)) return 'Waiting';
  return 'In progress';
};
export const nextStep = (ticket) => ({
  SUBMITTED: 'Your Head of Department will review this request.',
  HOD_APPROVED: 'Your HOD approved it. The Dean will review it next.',
  DEAN_APPROVED: 'The Dean approved it. The Head of Maintenance will choose a supervisor.',
  FORWARDED_TO_SUPERVISOR: 'The supervisor will assign a technician to inspect the problem.',
  TECHNICIAN_ASSIGNED: `${ticket.assignedTo?.name || 'The technician'} will inspect the problem and send a report.`,
  INSPECTION_COMPLETED: 'The inspection report is ready. The supervisor will arrange the work and materials.',
  ARRANGEMENTS_IN_PROGRESS: `${ticket.assignedTo?.name || 'The technician'} will carry out the work and report the actual time and materials used.`,
  TECHNICIAN_COMPLETED: 'The technician finished the work. The supervisor will check it, review the report, and give a rating.',
  COMPLETED: ticket.supervisorReview ? `The supervisor checked the work and rated it ${ticket.supervisorReview.rating}/5. This request is complete.` : 'The supervisor has completed this request. No further action is needed.',
  HOD_REJECTED: ticket.rejectionReason || 'Your HOD could not approve this request.',
  DEAN_REJECTED: ticket.rejectionReason || 'The Dean could not approve this request.'
}[ticket.workflowStatus] || 'Open this request to view its progress.');
export const visibleRequests = (tickets, user, role) => role === 'general_user' ? tickets.filter((ticket) => isOwnRequest(ticket, user)) : tickets;
