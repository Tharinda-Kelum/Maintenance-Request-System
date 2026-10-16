import React, { useState } from 'react';
import { ArrowLeft, Printer, MapPin, UserRound, ClipboardCheck } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { WorkflowProgress } from '../../components/ticket/WorkflowProgress';
import { WorkflowActionModal } from '../../components/ticket/WorkflowActionModal';
import { TicketTimeline } from '../../components/ticket/TicketTimeline';
import { TicketActivityFeed } from '../../components/ticket/TicketActivityFeed';
import { AttachmentGallery } from '../../components/ticket/AttachmentGallery';
import { actionForTicket, opensWorkspace } from '../../utils/workflow';
import { CompletionReport } from '../../components/ticket/CompletionReport';
import { nextStep } from '../../utils/requestHelpers';

export const RequestDetailPage = ({ ticketId, onBack, onOpenWorkspace }) => {
  const { tickets } = useTickets();
  const { activeRoleId } = useAuth();
  const [showAction, setShowAction] = useState(false);
  const ticket = tickets.find((item) => item.id === ticketId);
  if (!ticket) return <section className="ui-panel friendly-empty"><h1>Request not available</h1><p>This request may have moved to another person or may not be available to your account.</p><button className="ui-button secondary" onClick={onBack}>Back to requests</button></section>;
  const action = actionForTicket(ticket, activeRoleId);
  return <div className="portal-page request-detail">
    <button className="text-action self-start" onClick={onBack}><ArrowLeft size={17} /> Back to requests</button>
    <div className="page-heading"><div><div className="request-meta"><span>{ticket.id}</span><StatusBadge status={ticket.status} /><PriorityBadge priority={ticket.priority} /></div><h1>{ticket.title}</h1><p>Reported by {ticket.requester.name} · {ticket.submittedAt}</p></div><button className="ui-button secondary" onClick={() => window.print()}><Printer size={17} /> Print request</button></div>
    <section className="ui-panel next-step-panel"><p className="eyebrow">WHAT HAPPENS NEXT</p><h2>{nextStep(ticket)}</h2>{action && <button className="ui-button primary" onClick={() => opensWorkspace(action) ? onOpenWorkspace(ticket.id) : setShowAction(true)}>{action.label}</button>}</section>
    <div className="dashboard-columns"><div className="space-y-5">
      <section className="ui-panel help-panel"><h2>Reported problem</h2><p className="whitespace-pre-wrap">{ticket.description}</p><div className="detail-facts"><div><span>Category</span><strong>{ticket.category}</strong></div><div><span>Priority</span><strong>{ticket.priority}</strong></div><div><span>Last updated</span><strong>{ticket.lastUpdated}</strong></div></div></section>
      {ticket.inspectionReport && <section className="ui-panel help-panel"><h2><ClipboardCheck size={20} className="inline mr-2" /> Inspection report</h2><dl className="inspection-report"><dt>Findings</dt><dd>{ticket.inspectionReport.details}</dd><dt>Required materials / arrangements</dt><dd>{ticket.inspectionReport.requiredMaterials || 'None listed'}</dd><dt>Estimated work time</dt><dd>{ticket.inspectionReport.estimatedTimeHours} hours</dd><dt>Report submitted</dt><dd>{ticket.inspectionReport.submittedAt}</dd></dl></section>}
      {ticket.arrangements && <section className="ui-panel help-panel"><h2>Supervisor’s arrangements</h2><p className="whitespace-pre-wrap">{ticket.arrangements}</p>{ticket.arrangementMaterials?.length > 0 && <dl className="inspection-report"><dt>Arranged materials</dt>{ticket.arrangementMaterials.map((item) => <dd key={item.itemId}>{item.name}: {item.quantity} {item.unit}</dd>)}</dl>}</section>}
      {ticket.completionReport && <section className="ui-panel help-panel"><CompletionReport ticket={ticket} /></section>}
      {ticket.completionNotes && !ticket.supervisorReview && <section className="ui-panel help-panel"><h2>Completion notes</h2><p className="whitespace-pre-wrap">{ticket.completionNotes}</p></section>}
      <AttachmentGallery attachments={ticket.attachments} />
      <TicketActivityFeed ticket={ticket} />
      <details className="ui-panel"><summary className="p-5 cursor-pointer font-semibold text-sm">Full request history ({ticket.timeline.length} updates)</summary><TicketTimeline timeline={ticket.timeline} currentStatus={ticket.status} /></details>
    </div><aside className="space-y-5">
      <WorkflowProgress ticket={ticket} />
      <section className="ui-panel help-panel"><h2><MapPin size={19} className="inline mr-2" /> Location</h2><p>{ticket.room}, {ticket.floor}</p><p>{ticket.building}</p><p>{ticket.locationNotes}</p><p>{ticket.department}</p><p>{ticket.faculty}</p></section>
      <section className="ui-panel help-panel"><h2><UserRound size={19} className="inline mr-2" /> Maintenance team</h2><p>Supervisor: <strong>{ticket.supervisor?.name || 'Not yet assigned'}</strong></p><p>Technician: <strong>{ticket.assignedTo?.name || 'Not yet assigned'}</strong></p>{ticket.assignedTo?.phone && <a className="text-action mt-2" href={`tel:${ticket.assignedTo.phone.replace(/[^+\d]/g, '')}`}>{ticket.assignedTo.phone}</a>}</section>
    </aside></div>
    {showAction && <WorkflowActionModal ticket={ticket} onClose={() => setShowAction(false)} />}
  </div>;
};
