import React, { useState } from 'react';
import { Search, Wrench, ArrowRight } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { requestGroup } from '../../utils/requestHelpers';

export const TechnicianWorkloadPage = ({ onSelectTicket }) => {
  const { technicians, tickets } = useTickets();
  const [query, setQuery] = useState('');
  return <div className="portal-page"><div className="page-heading"><div><p className="eyebrow">MAINTENANCE TEAM</p><h1>Technician workload</h1><p>Find the right specialist and see their current assignments.</p></div></div><label className="search-field"><Search size={18} /><span className="sr-only">Search technicians</span><input placeholder="Search by name or skill" value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="report-grid">{technicians.filter((technician) => `${technician.name} ${technician.trade}`.toLowerCase().includes(query.trim().toLowerCase())).map((technician) => {
    const assigned = tickets.filter((ticket) => ticket.assignedTo?.id === technician.id && !['Completed', 'Rejected'].includes(requestGroup(ticket.status)));
    return <section key={technician.id} className="ui-panel help-panel"><div className="panel-heading p-0"><h2><Wrench size={20} className="inline mr-2" />{technician.name}</h2><span className="muted">{assigned.length} active</span></div><p>{technician.trade}</p><a className="text-action mt-2" href={`tel:${technician.phone?.replace(/[^+\d]/g, '')}`}>{technician.phone}</a>{assigned.length ? assigned.map((ticket) => <button className="request-row px-0" key={ticket.id} onClick={() => onSelectTicket(ticket.id)}><div className="request-row-main"><h3>{ticket.title}</h3><p>{ticket.id} · {ticket.status}</p></div><ArrowRight size={16} /></button>) : <p className="mt-5">No active assignments.</p>}</section>;
  })}</div></div>;
};
