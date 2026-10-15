import React, { useState } from 'react';
import { Plus, ArrowRight, Clock, Wrench, CheckCircle2, FileText, MapPin, CircleHelp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';
import { useSettings } from '../../context/SettingsContext';
import { StatusBadge } from '../../components/common/Badge';
import { isOwnRequest, requestGroup, nextStep } from '../../utils/requestHelpers';

export const StaffDashboard = ({ onNavigate, onSelectTicket }) => {
  const { currentUser } = useAuth();
  const { tickets } = useTickets();
  const { settings } = useSettings();
  const [filter, setFilter] = useState('All');
  const myTickets = tickets.filter((ticket) => isOwnRequest(ticket, currentUser));
  const needsConfirmation = myTickets.filter((ticket) => requestGroup(ticket.status) === 'Needs confirmation');
  const groups = [
    { label: 'All', title: 'Total requests', icon: FileText, hint: 'Everything you have reported' },
    { label: 'Waiting', title: 'Waiting for review', icon: Clock, hint: 'Your department will review these' },
    { label: 'In progress', title: 'Being worked on', icon: Wrench, hint: 'Assigned, in repair, or waiting for parts' },
    { label: 'Completed', title: 'Completed', icon: CheckCircle2, hint: 'Repairs confirmed as fixed' },
  ];
  const filtered = myTickets.filter((ticket) => filter === 'All' || requestGroup(ticket.status) === filter);

  return (
    <div className="portal-page">
      <div className="page-heading">
        <div><p className="eyebrow">YOUR MAINTENANCE PORTAL</p><h1>Hello, {currentUser.name}</h1><p>Report a problem and follow your repairs, all in one place.</p></div>
        <button className="ui-button secondary" onClick={() => onNavigate('my_requests')}>View all my requests <ArrowRight size={17} /></button>
      </div>
      <section className="welcome-card">
        <div className="welcome-icon"><Wrench size={28} /></div>
        <div className="flex-1"><h2>Something needs fixing?</h2><p>Tell us what is wrong and where it is. We will help you track what happens next.</p></div>
        <button className="ui-button primary" onClick={() => onNavigate('create_request')}><Plus size={19} /> New request</button>
      </section>
      {needsConfirmation.length > 0 && <section className="notice-card" aria-label="Repairs awaiting your confirmation">
        <CheckCircle2 size={23} className="shrink-0" />
        <div className="flex-1"><h2>{needsConfirmation.length} {needsConfirmation.length === 1 ? 'repair is' : 'repairs are'} ready for you to check</h2><p>Open the request and confirm whether the problem is fixed.</p></div>
        <button className="ui-button secondary" onClick={() => onSelectTicket(needsConfirmation[0].id)}>Check repair <ArrowRight size={16} /></button>
      </section>}
      <div className="summary-grid">
        {groups.map(({ label, title, icon: Icon, hint }) => <button key={label} className={`summary-card ${filter === label ? 'selected' : ''}`} aria-pressed={filter === label} onClick={() => setFilter(label)}>
          <span className="summary-icon"><Icon size={20} /></span>
          <strong>{label === 'All' ? myTickets.length : myTickets.filter((ticket) => requestGroup(ticket.status) === label).length}</strong>
          <span className="summary-title">{title}</span><span className="summary-hint">{hint}</span>
        </button>)}
      </div>
      <div className="dashboard-columns">
        <section className="ui-panel">
          <div className="panel-heading"><div><h2>My recent requests</h2><p>Open a request to see updates or send a message.</p></div><button className="text-action" onClick={() => onNavigate('my_requests')}>View all <ArrowRight size={16} /></button></div>
          <div className="simple-tabs" aria-label="Filter recent requests">{['All', 'Waiting', 'In progress', 'Needs confirmation', 'Completed'].map((label) => <button key={label} aria-pressed={filter === label} className={filter === label ? 'active' : ''} onClick={() => setFilter(label)}>{label}</button>)}</div>
          {filtered.length === 0 ? <div className="friendly-empty"><FileText size={30} /><h3>{myTickets.length ? 'No requests in this group' : 'Your requests will appear here'}</h3><p>{myTickets.length ? 'Choose another status to see your requests.' : 'Start by reporting something that needs attention.'}</p><button className="ui-button secondary" onClick={() => myTickets.length ? setFilter('All') : onNavigate('create_request')}>{myTickets.length ? 'Show all requests' : 'Create your first request'}</button></div>
            : <div className="request-list">{filtered.slice(0, 5).map((ticket) => <button className="request-row" key={ticket.id} onClick={() => onSelectTicket(ticket.id)}>
              <div className="request-row-main"><div className="request-meta"><span>{ticket.id}</span><StatusBadge status={ticket.status} /></div><h3>{ticket.title}</h3><p className="request-location"><MapPin size={14} />{ticket.room} · {ticket.building}</p><p>{nextStep(ticket)}</p></div><ArrowRight size={20} className="row-arrow" />
            </button>)}</div>}
        </section>
        <aside className="space-y-5">
          <section className="ui-panel help-panel"><h2>How it works</h2><ol className="how-it-works">{[
            ['Report the problem', 'Add a short description and the location.'],
            ['We arrange the repair', 'Your department reviews it and sends a technician.'],
            ['Confirm it is fixed', 'Check the finished work and close your request.'],
          ].map(([title, text], index) => <li key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>
          <section className="ui-panel help-panel">
            <CircleHelp size={23} className="mb-3" /><h2>Need a hand?</h2>
            <p>Contact the Works & Maintenance Division for help with your request.</p>
            <a className="text-action mt-4" href={`mailto:${settings.supportEmail}`}>Email maintenance <ArrowRight size={15} /></a>
            <p className="mt-2">University extension: <strong>{settings.supportExtension}</strong></p>
            <p className="mt-2">{settings.campusHours}</p>
            <button className="text-action mt-4" onClick={() => onNavigate('campus_info')}>Find campus locations <ArrowRight size={15} /></button>
          </section>
        </aside>
      </div>
    </div>
  );
};
