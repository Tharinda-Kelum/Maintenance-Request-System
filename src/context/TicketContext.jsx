import React, { createContext, useContext } from 'react';
import { api, uploadAttachments } from '../api/client';
import { useApiResource } from '../hooks/useApiResource';
import { useToast } from './ToastContext';

const TicketContext = createContext(null);
const actions = { hodReview: 'hod-review', deanReview: 'dean-review', forward: 'forward-head', assign: 'assign-tech', inspection: 'inspection-report', arrangements: 'fulfill-arrangements', completionReport: 'completion-report', supervisorReview: 'supervisor-review' };
export const TicketProvider = ({ children }) => {
  const requests = useApiResource('/workflow/tickets', [], { poll: 15000 });
  const directory = useApiResource('/auth/technicians', []);
  const { showToast } = useToast();
  const updateTicket = (ticket) => requests.setData((previous) => previous.some((item) => item.id === ticket.id) ? previous.map((item) => item.id === ticket.id ? ticket : item) : [ticket, ...previous]);
  const createTicket = async (details) => {
    const attachmentIds = await uploadAttachments(details.attachments);
    const { attachments: _attachments, ...body } = details;
    const result = await api('/workflow/tickets', { method: 'POST', body: { ...body, attachmentIds } });
    updateTicket(result.data);
    showToast(`Request ${result.data.id} sent for HOD approval.`, 'success');
    return result.data;
  };
  const workflowAction = async (action, ticketId, details = {}) => {
    const result = await api(`/workflow/tickets/${actions[action]}`, { method: 'POST', body: { ticketId, ...details } });
    updateTicket(result.data); showToast(`Request updated: ${result.data.status}.`, 'success');
    return result.data;
  };
  const addComment = async (ticketId, text, _author, attachments = []) => {
    const attachmentIds = await uploadAttachments(attachments);
    const result = await api(`/workflow/tickets/${encodeURIComponent(ticketId)}/comments`, { method: 'POST', body: { text, attachmentIds } });
    updateTicket(result.data); showToast('Message sent.', 'success');
    return result.data;
  };
  return <TicketContext.Provider value={{ tickets: requests.data, technicians: directory.data.filter((user) => user.backendRole === 'TECHNICIAN'), supervisors: directory.data.filter((user) => user.backendRole === 'SUPERVISOR'), loading: requests.loading || directory.loading, ready: requests.ready && directory.ready, error: requests.error || directory.error, reload: () => Promise.all([requests.reload(), directory.reload()]), createTicket, workflowAction, addComment }}>{children}</TicketContext.Provider>;
};
export const useTickets = () => useContext(TicketContext);
