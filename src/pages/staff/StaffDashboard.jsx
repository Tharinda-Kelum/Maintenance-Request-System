import React, { useState } from 'react';
import { Plus, ArrowRight, Clock, Wrench, CheckCircle2, FileText, MapPin, CircleHelp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';
import { useSettings } from '../../context/SettingsContext';
import { StatusBadge } from '../../components/common/Badge';
import { requestGroup, nextStep } from '../../utils/requestHelpers';

export const StaffDashboard = ({ onNavigate, onSelectTicket }) => {
  const { currentUser } = useAuth();
  const { tickets } = useTickets();
  const { settings } = useSettings();
  const [filter, setFilter] = useState('All');
  const groups = [
    { label: 'All', title: 'Total requests', icon: FileText, hint: 'Everything you have reported' },
    { label: 'Waiting', title: 'Waiting for approval', icon: Clock, hint: 'HOD, Dean, or maintenance review' },
    { label: 'In progress', title: 'Inspection & work', icon: Wrench, hint: 'The maintenance team is handling these' },
    { label: 'Completed', title: 'Completed', icon: CheckCircle2, hint: 'Closed by the supervisor' }
  ];
  const filtered = tickets.filter((ticket) => filter === 'All' || requestGroup(ticket.status) === filter);
  return <div className="portal-page">
    <div className="page-heading"><div><p className="eyebrow">YOUR MAINTENANCE PORTAL</p><h1>Hello, {currentUser.name}</h1><p>Report a problem and follow every step, from approval to completion.</p></div><button className="ui-button secondary" onClick={() => onNavigate('my_requests')}>View all my requests <ArrowRight size={17} /></button></div>
    <section className="welcome-card"><div className="welcome-icon"><Wrench size={28} /></div><div className="flex-1"><h2>Something needs fixing?</h2><p>Tell us what is wrong and where it is. Your HOD will review it first.</p></div><button className="ui-button primary" onClick={() => onNavigate('create_request')}><Plus size={19} /> New request</button></section>
    <div className="summary-grid">{groups.map(({ label, title, icon: Icon, hint }) => <button key={label} className={`summary-card ${filter === label ? 'selected' : ''}`} aria-pressed={filter === label} onClick={() => setFilter(label)}><span className="summary-icon"><Icon size={20} /></span><strong>{label === 'All' ? tickets.length : tickets.filter((ticket) => requestGroup(ticket.status) === label).length}</strong><span className="summary-title">{title}</span><span className="summary-hint">{hint}</span></button>)}</div>
    <div className="dashboard-columns"><section className="ui-panel"><div className="panel-heading"><div><h2>My recent requests</h2><p>Open a request to see who is handling the next step.</p></div><button className="text-action" onClick={() => onNavigate('my_requests')}>View all <ArrowRight size={16} /></button></div><div className="simple-tabs" aria-label="Filter recent requests">{['All', 'Waiting', 'In progress', 'Completed', 'Rejected'].map((label) => <button key={label} className={filter === label ? 'active' : ''} aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>)}</div>
      {!filtered.length ? <div className="friendly-empty"><FileText size={31} /><h2>{tickets.length ? 'No requests in this group' : 'Your requests will appear here'}</h2><p>{tickets.length ? 'Choose another group to see your requests.' : 'Start by telling us about something that needs attention.'}</p><button className="ui-button secondary" onClick={() => tickets.length ? setFilter('All') : onNavigate('create_request')}>{tickets.length ? 'Show all requests' : 'Create your first request'}</button></div> : filtered.slice(0, 5).map((ticket) => <button className="request-row" key={ticket.id} onClick={() => onSelectTicket(ticket.id)}><div className="request-row-main"><div className="request-meta"><span>{ticket.id}</span><StatusBadge status={ticket.status} /></div><h3>{ticket.title}</h3><p className="request-location"><MapPin size={14} />{ticket.room} · {ticket.building}</p><p>{nextStep(ticket)}</p></div><ArrowRight size={20} className="row-arrow" /></button>)}
    </section><aside className="space-y-5"><section className="ui-panel help-panel"><h2>How it works</h2><ol className="how-it-works">{[['Report the problem', 'Add a description, location, and optional photos.'], ['HOD & Dean review', 'Your department and faculty approve the request.'], ['Maintenance takes care of it', 'A technician inspects and repairs it. The supervisor checks the completion report and rates the work.']].map(([title, description], index) => <li key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></section><section className="ui-panel help-panel"><CircleHelp size={23} className="mb-3" /><h2>Need a hand?</h2><p>Contact Works & Maintenance for help with your request.</p><a className="text-action mt-4" href={`mailto:${settings.supportEmail}`}>Email maintenance <ArrowRight size={15} /></a><p className="mt-2">University extension: <strong>{settings.supportExtension}</strong></p><p className="mt-2">{settings.campusHours}</p><button className="text-action mt-4" onClick={() => onNavigate('campus_info')}>Find campus locations <ArrowRight size={15} /></button></section></aside></div>
  </div>;
};
