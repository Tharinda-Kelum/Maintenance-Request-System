import React, { useState } from 'react';
import { Search, Plus, Download, ArrowRight, MapPin, SlidersHorizontal, FileText } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { CATEGORIES } from '../../data/mockData';
import { visibleRequests, requestGroup, nextStep } from '../../utils/requestHelpers';
import { downloadCSV } from '../../utils/downloadCSV';

export const MyRequestsPage = ({ onNavigate, onSelectTicket }) => {
  const { tickets } = useTickets();
  const { currentUser, activeRoleId } = useAuth();
  const isUser = activeRoleId === 'general_user';
  const requests = visibleRequests(tickets, currentUser, activeRoleId);
  const [status, setStatus] = useState('All');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const filtered = requests.filter((ticket) => (status === 'All' || requestGroup(ticket.status) === status)
    && (category === 'All' || ticket.category === category)
    && (priority === 'All' || ticket.priority === priority)
    && [ticket.id, ticket.title, ticket.room, ticket.building, ticket.requester.name].some((value) => value?.toLowerCase().includes(query.trim().toLowerCase())));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const reset = () => { setStatus('All'); setQuery(''); setCategory('All'); setPriority('All'); setPage(1); };
  const exportCSV = () => {
    const rows = [['Request ID', 'Issue', 'Location', 'Category', 'Priority', 'Status', 'Requester', 'Assigned to', 'Actual work time (minutes)', 'Actual materials used', 'Supervisor rating (out of 5)'], ...filtered.map((ticket) => [ticket.id, ticket.title, `${ticket.room}, ${ticket.building}`, ticket.category, ticket.priority, ticket.status, ticket.requester.name, ticket.assignedTo?.name || 'Not assigned', ticket.completionReport?.actualTimeMinutes ?? '', ticket.completionReport?.materials?.map((item) => `${item.name}: ${item.quantity} ${item.unit}`).join('; ') || '', ticket.supervisorReview?.rating ?? ''])];
    downloadCSV(rows, 'maintenance-requests.csv');
  };

  return <div className="portal-page">
    <div className="page-heading"><div><p className="eyebrow">{isUser ? 'YOUR MAINTENANCE' : 'MAINTENANCE'}</p><h1>{isUser ? 'My requests' : 'Maintenance requests'}</h1><p>{isUser ? 'Track the problems you have reported and see the latest updates.' : 'Find requests, check their progress, and open them to take action.'}</p></div><div className="button-group"><button className="ui-button secondary" onClick={exportCSV} disabled={!filtered.length}><Download size={17} /> Export CSV</button>{isUser && <button className="ui-button primary" onClick={() => onNavigate('create_request')}><Plus size={18} /> New request</button>}</div></div>
    <section className="ui-panel">
      <div className="request-toolbar"><label className="search-field"><Search size={18} /><span className="sr-only">Search requests</span><input type="search" placeholder="Search by request number, issue, or room" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label><button className="ui-button secondary" aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={17} /> Filters{(category !== 'All' || priority !== 'All') && ' applied'}</button></div>
      {showFilters && <div className="filter-fields"><label>Category<select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option value="All">All categories</option>{CATEGORIES.map((item) => <option key={item.id}>{item.name}</option>)}</select></label><label>Priority<select value={priority} onChange={(event) => { setPriority(event.target.value); setPage(1); }}><option value="All">All priorities</option>{['Low', 'Medium', 'High', 'Urgent'].map((item) => <option key={item}>{item}</option>)}</select></label><button className="text-action" onClick={reset}>Clear filters</button></div>}
      <div className="simple-tabs" aria-label="Request status">{['All', 'Waiting', 'In progress', 'Completed', 'Rejected'].map((item) => <button key={item} className={status === item ? 'active' : ''} aria-pressed={status === item} onClick={() => { setStatus(item); setPage(1); }}>{item} <span>{requests.filter((ticket) => item === 'All' || requestGroup(ticket.status) === item).length}</span></button>)}</div>
      <p className="results-caption" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'request' : 'requests'} found</p>
      {!filtered.length ? <div className="friendly-empty"><FileText size={32} /><h2>{requests.length ? 'No matching requests' : 'No requests yet'}</h2><p>{requests.length ? 'Try a different search or clear your filters.' : 'Report your first maintenance problem to get started.'}</p><button className="ui-button secondary" onClick={requests.length ? reset : () => onNavigate('create_request')}>{requests.length ? 'Clear search and filters' : 'New request'}</button></div>
        : <div className="request-list">{filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((ticket) => <button className="request-row" key={ticket.id} onClick={() => onSelectTicket(ticket.id)}><div className="request-row-main"><div className="request-meta"><span>{ticket.id}</span><StatusBadge status={ticket.status} /><PriorityBadge priority={ticket.priority} /></div><h2>{ticket.title}</h2><p className="request-location"><MapPin size={14} />{ticket.room} · {ticket.building}</p><p>{isUser ? nextStep(ticket) : `${ticket.requester.name} · ${ticket.category} · ${ticket.assignedTo?.name || 'No technician assigned'}`}</p><span className="request-date">Submitted {ticket.submittedAt}</span></div><span className="request-open">View details <ArrowRight size={17} /></span></button>)}</div>}
      {filtered.length > 0 && <div className="pagination"><span>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)}</span><div className="button-group"><button className="ui-button secondary" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><span>{currentPage} / {pages}</span><button className="ui-button secondary" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></div></div>}
    </section>
  </div>;
};
