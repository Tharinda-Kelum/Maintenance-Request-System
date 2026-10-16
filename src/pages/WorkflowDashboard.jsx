import React, { useState } from 'react';
import { Clock, FileText, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { WorkflowActionModal } from '../components/ticket/WorkflowActionModal';
import { actionForTicket, opensWorkspace } from '../utils/workflow';
import { nextStep, requestGroup } from '../utils/requestHelpers';

const roleCopy = {
  dept_admin: ['Department requests', 'Review staff requests and send approved requests to the Dean.'],
  dean: ['Faculty approvals', 'Review HOD-approved requests before they go to maintenance.'],
  maintenance_head: ['Maintenance coordination', 'Choose a supervisor for each Dean-approved request.'],
  supervisor: ['My supervised requests', 'Arrange the work, then check and rate the technician’s completion report.'],
  technician: ['My tasks', 'Inspect problems, complete arranged work, and report the actual time and materials used.']
};

export const WorkflowDashboard = ({ onSelectTicket, onOpenWorkspace }) => {
  const { currentUser, activeRoleId } = useAuth();
  const { tickets } = useTickets();
  const [filter, setFilter] = useState('Action needed');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [title, description] = roleCopy[activeRoleId] || ['Requests', 'Track the current maintenance work.'];
  const pending = tickets.filter((ticket) => actionForTicket(ticket, activeRoleId));
  const completed = tickets.filter((ticket) => ticket.workflowStatus === 'COMPLETED');
  const visible = tickets.filter((ticket) => (filter !== 'Action needed' || actionForTicket(ticket, activeRoleId)) && (filter !== 'Completed' || ticket.workflowStatus === 'COMPLETED') && [ticket.id, ticket.title, ticket.room, ticket.requester.name].some((value) => value.toLowerCase().includes(query.trim().toLowerCase())));
  return <div className="portal-page">
    <div className="page-heading"><div><p className="eyebrow">{currentUser.roleName}</p><h1>{title}</h1><p>{description}</p></div></div>
    <div className="summary-grid three-columns">{[['Action needed', pending.length, Clock], ['All requests', tickets.length, FileText], ['Completed', completed.length, CheckCircle2]].map(([label, count, Icon]) => <button className={`summary-card ${filter === label ? 'selected' : ''}`} key={label} onClick={() => setFilter(label)}><span className="summary-icon"><Icon size={21} /></span><strong>{count}</strong><span className="summary-title">{label}</span></button>)}</div>
    <section className="ui-panel"><div className="panel-heading"><div><h2>{filter}</h2><p>{filter === 'Action needed' ? 'These requests are ready for your next step.' : 'Open a request to see its full history.'}</p></div></div><div className="request-toolbar pt-0"><label className="search-field"><Search size={18} /><span className="sr-only">Search requests</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search request number, issue, or room" /></label></div>
      {!visible.length ? <div className="friendly-empty"><CheckCircle2 size={32} /><h2>{query ? 'No matching requests' : filter === 'Action needed' ? 'Nothing needs your action right now' : 'No requests in this group'}</h2><p>{filter === 'Action needed' ? 'Requests will appear here when the previous step is complete.' : 'Try another group or search.'}</p>{filter !== 'All requests' && <button className="ui-button secondary" onClick={() => setFilter('All requests')}>View all requests</button>}</div> : visible.map((ticket) => {
        const action = actionForTicket(ticket, activeRoleId);
        return <article className="request-row" key={ticket.id}><div className="request-row-main"><div className="request-meta"><span>{ticket.id}</span><StatusBadge status={ticket.status} /><PriorityBadge priority={ticket.priority} /></div><button className="text-left" onClick={() => onSelectTicket(ticket.id)}><h3>{ticket.title}</h3></button><p>{ticket.requester.name} · {ticket.room}</p><p>{nextStep(ticket)}</p><button className="text-action" onClick={() => onSelectTicket(ticket.id)}>View details <ArrowRight size={15} /></button></div>{action && <button className="ui-button primary" onClick={() => opensWorkspace(action) ? onOpenWorkspace(ticket.id) : setSelectedId(ticket.id)}>{action.label}</button>}{!action && <span className="muted">{requestGroup(ticket.status)}</span>}</article>;
      })}
    </section>
    {selectedId && <WorkflowActionModal key={selectedId} ticket={tickets.find((ticket) => ticket.id === selectedId)} onClose={() => setSelectedId(null)} />}
  </div>;
};
