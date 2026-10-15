export const isOwnRequest = (ticket, user) => ticket.requester?.email === user?.email;

export const requestGroup = (status) => {
  if (['Submitted', 'Pending Review', 'Approved'].includes(status)) return 'Waiting';
  if (['Assigned', 'Inspection', 'In Progress', 'Awaiting Parts'].includes(status)) return 'In progress';
  if (status === 'Repair Completed') return 'Needs confirmation';
  if (['Resolved', 'Completed'].includes(status)) return 'Completed';
  return 'Rejected';
};

export const nextStep = (ticket) => ({
  Waiting: 'Your department will review your request and arrange a technician.',
  'In progress': ticket.status === 'Awaiting Parts'
    ? 'The team is waiting for spare parts. You can follow updates here.'
    : `${ticket.assignedTo?.name || 'The maintenance team'} is handling your request.`,
  'Needs confirmation': 'The repair is finished. Check the work and confirm it is fixed.',
  Completed: 'You have confirmed this issue is fixed. No further action is needed.',
  Rejected: ticket.rejectionReason || 'Your department could not approve this request. Open it to see the details.',
}[requestGroup(ticket.status)]);

export const visibleRequests = (tickets, user, role) => role === 'general_user'
  ? tickets.filter((ticket) => isOwnRequest(ticket, user))
  : role === 'dept_admin' ? tickets.filter((ticket) => ticket.department === user?.department)
  : tickets;
