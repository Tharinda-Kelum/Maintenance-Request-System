import React, { useState } from 'react';
import { ArrowRight, Clock, Wrench, CheckCircle2, FileText, Search } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { ReviewTicketDrawer } from './ReviewTicketDrawer';
import { AssignTechnicianModal } from './AssignTechnicianModal';
import { requestGroup } from '../../utils/requestHelpers';

export const DeptAdminDashboard = ({ onNavigate, onSelectTicket, reviewOnly = false }) => {
  const { tickets } = useTickets();
  const { currentUser } = useAuth();
  const [reviewId, setReviewId] = useState(null);
  const [assignId, setAssignId] = useState(null);
  const [query, setQuery] = useState('');
  const departmentTickets = tickets.filter((ticket) => ticket.department === currentUser.department);
  const pending = departmentTickets.filter((ticket) => ['Submitted', 'Pending Review'].includes(ticket.status));
  const unassigned = departmentTickets.filter((ticket) => ticket.status === 'Approved' && !ticket.assignedTo);
  const active = departmentTickets.filter((ticket) => ['Approved', 'Assigned', 'Inspection', 'In Progress', 'Awaiting Parts', 'Repair Completed'].includes(ticket.status));
  const queue = (reviewOnly ? pending : [...pending, ...active]).filter((ticket) => [ticket.id, ticket.title, ticket.requester.name].some((value) => value.toLowerCase().includes(query.trim().toLowerCase())));
  return <div className="portal-page">
    <div className="page-heading"><div><p className="eyebrow">{currentUser.department}</p><h1>{reviewOnly ? 'Review requests' : 'Department maintenance'}</h1><p>{reviewOnly ? 'Check new requests, approve or reject them, then assign a technician.' : 'Review new problems and keep your department’s repairs moving.'}</p></div><button className="ui-button secondary" onClick={() => onNavigate('reports')}>View reports <ArrowRight size={17} /></button></div>
    {!reviewOnly && <div className="summary-grid">{[
      ['Needs review', pending.length, Clock, () => onNavigate('review_queue')],
      ['Needs a technician', unassigned.length, Wrench, () => { if (unassigned[0]) setAssignId(unassigned[0].id); }],
      ['Active repairs', active.length, FileText, () => onNavigate('requests')],
      ['Completed', departmentTickets.filter((ticket) => requestGroup(ticket.status) === 'Completed').length, CheckCircle2, () => onNavigate('reports')],
    ].map(([title, count, Icon, action]) => <button key={title} className="summary-card" onClick={action} disabled={title === 'Needs a technician' && !count}><span className="summary-icon"><Icon size={20} /></span><strong>{count}</strong><span className="summary-title">{title}</span></button>)}</div>}
    <section className="ui-panel"><div className="panel-heading"><div><h2>{reviewOnly ? 'Requests awaiting review' : 'Requests that need attention'}</h2><p>{reviewOnly ? 'Read the request before choosing your decision.' : 'Start with a review, then assign approved requests.'}</p></div><button className="text-action" onClick={() => onNavigate('requests')}>All requests <ArrowRight size={16} /></button></div><div className="request-toolbar pt-0"><label className="search-field"><Search size={18} /><span className="sr-only">Search department requests</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search request number, issue, or requester" /></label></div>
      {!queue.length ? <div className="friendly-empty"><CheckCircle2 size={32} /><h2>No requests waiting here</h2><p>{query ? 'Try another search.' : 'New department requests will appear here when they need attention.'}</p></div> : queue.map((ticket) => <article className="request-row" key={ticket.id}><div className="request-row-main"><div className="request-meta"><span>{ticket.id}</span><StatusBadge status={ticket.status} /><PriorityBadge priority={ticket.priority} /></div><button className="text-left" onClick={() => onSelectTicket(ticket.id)}><h3>{ticket.title}</h3></button><p>{ticket.requester.name} · {ticket.room} · {ticket.category}</p><p>{ticket.assignedTo ? `Technician: ${ticket.assignedTo.name}` : 'No technician assigned'}</p><button className="text-action" onClick={() => onSelectTicket(ticket.id)}>View details <ArrowRight size={15} /></button></div>{['Submitted', 'Pending Review'].includes(ticket.status) ? <button className="ui-button primary" onClick={() => setReviewId(ticket.id)}>Review request</button> : ticket.status !== 'Repair Completed' && <button className="ui-button secondary" onClick={() => setAssignId(ticket.id)}>{ticket.assignedTo ? 'Change technician' : 'Assign technician'}</button>}</article>)}
    </section>
    {reviewId && <ReviewTicketDrawer key={reviewId} isOpen ticket={tickets.find((ticket) => ticket.id === reviewId)} onClose={() => setReviewId(null)} onAssignAfterApprove={(ticket) => setAssignId(ticket.id)} />}
    {assignId && <AssignTechnicianModal key={assignId} isOpen ticket={tickets.find((ticket) => ticket.id === assignId)} onClose={() => setAssignId(null)} />}
  </div>;
};
