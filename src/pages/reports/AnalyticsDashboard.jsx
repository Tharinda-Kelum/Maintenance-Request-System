import React, { useState } from 'react';
import { Download, Printer, FileText, Clock, CheckCircle2, Wrench, ArrowRight } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { StatusDonut } from '../../components/charts/StatusDonut';
import { CategoryBarChart } from '../../components/charts/CategoryBarChart';
import { requestGroup } from '../../utils/requestHelpers';
import { downloadCSV } from '../../utils/downloadCSV';

const groups = ['Waiting', 'In progress', 'Completed', 'Rejected'];
const colors = ['#d97706', '#3b82f6', '#059669', '#e11d48'];

export const AnalyticsDashboard = ({ onNavigate, onSelectTicket }) => {
  const { tickets } = useTickets();
  const { currentUser, activeRoleId } = useAuth();
  const [faculty, setFaculty] = useState('All');
  const [period, setPeriod] = useState('All');
  const [now] = useState(() => Date.now());
  const isDepartment = activeRoleId === 'dept_admin';
  const scoped = isDepartment ? tickets.filter((ticket) => ticket.department === currentUser.department) : tickets;
  const filtered = scoped.filter((ticket) => {
    if (faculty !== 'All' && ticket.faculty !== faculty) return false;
    if (period === 'All') return true;
    const date = ticket.submittedAt.match(/\d{4}-\d{2}-\d{2}/)?.[0];
    if (!date) return false;
    const age = (now - new Date(`${date}T00:00:00`).getTime()) / 86400000;
    return age >= 0 && age < Number(period);
  });
  const completed = filtered.filter((ticket) => requestGroup(ticket.status) === 'Completed').length;
  const open = filtered.filter((ticket) => !['Completed', 'Rejected'].includes(requestGroup(ticket.status)));
  const categories = [...new Set(filtered.map((ticket) => ticket.category))].map((name) => {
    const count = filtered.filter((ticket) => ticket.category === name).length;
    return { name, count, percentage: filtered.length ? count / filtered.length * 100 : 0, color: 'bg-blue-500' };
  }).sort((a, b) => b.count - a.count);
  const exportCSV = () => {
    const rows = [['Status', 'Requests'], ...groups.map((group) => [group, filtered.filter((ticket) => requestGroup(ticket.status) === group).length]), [], ['Category', 'Requests'], ...categories.map((category) => [category.name, category.count])];
    downloadCSV(rows, 'maintenance-summary.csv');
  };
  return <div className="portal-page">
    <div className="page-heading"><div><p className="eyebrow">{isDepartment ? currentUser.department : 'CAMPUS MAINTENANCE'}</p><h1>{isDepartment ? 'Department reports' : 'Maintenance overview'}</h1><p>See where requests stand and which types of problems need attention.</p></div><div className="button-group"><button className="ui-button secondary" onClick={() => window.print()}><Printer size={17} /> Print report</button><button className="ui-button primary" disabled={!filtered.length} onClick={exportCSV}><Download size={17} /> Export CSV</button></div></div>
    <section className="ui-panel"><div className="filter-fields pt-5"><label>Time period<select value={period} onChange={(event) => setPeriod(event.target.value)}><option value="All">All available requests</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label>{!isDepartment && <label>Faculty / division<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option value="All">All faculties and divisions</option>{[...new Set(scoped.map((ticket) => ticket.faculty))].map((name) => <option key={name}>{name}</option>)}</select></label>}<span className="form-hint">Based on {filtered.length} matching requests</span></div></section>
    <div className="summary-grid">{[['Total requests', filtered.length, FileText], ['Still open', open.length, Clock], ['Completed', completed, CheckCircle2], ['Inspection reports', filtered.filter((ticket) => ticket.inspectionReport).length, Wrench]].map(([title, count, Icon]) => <div className="summary-card" key={title}><span className="summary-icon"><Icon size={20} /></span><strong>{count}</strong><span className="summary-title">{title}</span></div>)}</div>
    {!filtered.length ? <section className="ui-panel friendly-empty"><FileText size={32} /><h2>No requests for these filters</h2><p>Choose another period or faculty to see more data.</p><button className="ui-button secondary" onClick={() => { setFaculty('All'); setPeriod('All'); }}>Clear filters</button></section> : <div className="report-grid"><section className="ui-panel help-panel"><h2>Request progress</h2><p className="mb-6">Current status of the matching requests.</p><StatusDonut data={groups.map((label, index) => ({ label, value: filtered.filter((ticket) => requestGroup(ticket.status) === label).length, color: colors[index] })).filter((item) => item.value > 0)} /></section><section className="ui-panel help-panel"><h2>Types of problems</h2><p className="mb-6">Number of requests in each maintenance category.</p><CategoryBarChart data={categories} /></section></div>}
    {onNavigate && <section className="ui-panel"><div className="panel-heading"><div><h2>Open requests</h2><p>Open a request to review progress and take action.</p></div><button className="text-action" onClick={() => onNavigate('requests')}>View all <ArrowRight size={16} /></button></div>{open.length ? open.slice(0, 5).map((ticket) => <button className="request-row" key={ticket.id} onClick={() => onSelectTicket?.(ticket.id)}><div className="request-row-main"><div className="request-meta"><span>{ticket.id}</span><span>{ticket.status}</span></div><h3>{ticket.title}</h3><p>{ticket.room} · {ticket.assignedTo?.name || 'Not assigned'}</p></div><ArrowRight size={18} /></button>) : <p className="p-6">No open requests match the selected filters.</p>}</section>}
  </div>;
};
