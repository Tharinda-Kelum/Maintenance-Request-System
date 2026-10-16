import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { actionForTicket, opensWorkspace } from '../../utils/workflow';
import { MaterialSelector } from './MaterialSelector';
import { CompletionReport } from './CompletionReport';

export const WorkflowActionModal = ({ ticket, onClose }) => {
  const { activeRoleId } = useAuth();
  const { workflowAction, technicians, supervisors } = useTickets();
  const config = actionForTicket(ticket, activeRoleId);
  const [approve, setApprove] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [notes, setNotes] = useState('');
  const [materials, setMaterials] = useState(() => (ticket.arrangementMaterials?.length ? ticket.arrangementMaterials : ticket.inspectionReport?.materials || []).map((item) => ({ ...item, itemId: String(item.itemId) })));
  const [priority, setPriority] = useState(ticket.priority);
  const [rating, setRating] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!config || opensWorkspace(config)) return null;
  const people = config.kind === 'supervisor' ? supervisors : technicians;
  const submit = async (event) => {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError('');
    const details = { remarks: notes.trim() };
    if (config.kind === 'review') { details.approve = approve; if (activeRoleId === 'dept_admin') details.priority = priority; }
    if (config.kind === 'supervisor') details.supervisorId = selectedId;
    if (config.kind === 'technician') details.technicianId = selectedId;
    if (config.action === 'arrangements') details.isCompleted = config.isCompleted;
    if (config.kind === 'arrangements') details.materials = materials;
    if (config.kind === 'verification') { details.rating = Number(rating); details.confirmed = confirmed; }
    try { await workflowAction(config.action, ticket.id, details); onClose(); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  };
  return <Modal isOpen onClose={() => { if (!busy) onClose(); }} title={config.title} subtitle={`${ticket.id} · ${ticket.title}`} footer={<><button className="ui-button secondary" onClick={onClose} disabled={busy}>Cancel</button><button className="ui-button primary" type="submit" form="workflow-action" disabled={busy}>{busy ? 'Saving…' : config.kind === 'verification' ? 'Confirm & close request' : config.kind === 'review' ? approve ? 'Approve request' : 'Reject request' : config.label}</button></>}>
    <form id="workflow-action" className="form-fields" onSubmit={submit}>
      {error && <p className="form-error" role="alert">{error}</p>}
      {config.kind === 'review' && <div className="inspection-summary"><strong>Reported problem</strong><p>{ticket.description}</p><p>{ticket.room}, {ticket.building}</p><p>Requested by {ticket.requester.name}</p></div>}
      {config.kind === 'review' && <fieldset><legend>Your decision</legend><div className="decision-options"><label><input type="radio" name="decision" checked={approve} onChange={() => setApprove(true)} /> Approve</label><label><input type="radio" name="decision" checked={!approve} onChange={() => setApprove(false)} /> Reject</label></div></fieldset>}
      {config.kind === 'review' && activeRoleId === 'dept_admin' && <label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value)}>{['Low', 'Medium', 'High', 'Urgent'].map((item) => <option key={item}>{item}</option>)}</select></label>}
      {['supervisor', 'technician'].includes(config.kind) && <label>{config.kind === 'supervisor' ? 'Supervisor' : 'Technician'} *<select required value={selectedId} onChange={(event) => setSelectedId(event.target.value)}><option value="">Choose a {config.kind}</option>{people.map((person) => <option value={person.id} key={person.id}>{person.name}{person.trade ? ` — ${person.trade}` : ''}</option>)}</select>{!people.length && <span className="form-hint">No active {config.kind}s are registered. An account manager needs to add one first.</span>}</label>}
      {ticket.inspectionReport && config.kind !== 'verification' && <div className="inspection-summary"><strong>Inspection findings</strong><p>{ticket.inspectionReport.details}</p><p>Materials: {ticket.inspectionReport.requiredMaterials || 'None listed'}</p><p>Estimated work: {ticket.inspectionReport.estimatedTimeHours} hours</p></div>}
      {config.kind === 'verification' && <><CompletionReport ticket={ticket} /><fieldset className="work-rating"><legend>Work quality rating *</legend><div className="rating-options">{['Poor', 'Fair', 'Good', 'Very good', 'Excellent'].map((label, index) => <label key={label} title={label}><input type="radio" name="work-rating" value={index + 1} required checked={rating === String(index + 1)} onChange={(event) => setRating(event.target.value)} /><span>{index + 1} ★</span><span className="sr-only">{label}</span></label>)}</div><p className="form-hint">{rating ? ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'][Number(rating) - 1] : '1 = Poor · 5 = Excellent'}</p></fieldset></>}
      {config.kind === 'arrangements' && <MaterialSelector value={materials} onChange={setMaterials} disabled={busy} />}
      {config.kind !== 'arrangements' && <label>{config.kind === 'verification' ? 'Supervisor verification notes *' : config.kind === 'review' && !approve ? 'Reason for rejection *' : 'Notes (optional)'}<textarea rows={4} value={notes} maxLength={5000} required={config.kind === 'verification' || config.kind === 'review' && !approve} onChange={(event) => setNotes(event.target.value)} placeholder={config.kind === 'verification' ? 'Record your checks of the completed work, time, and material usage.' : 'Add a clear note for the next person.'} /></label>}
      {config.kind === 'review' && approve && <p className="form-hint">{activeRoleId === 'dept_admin' ? 'Approval sends this request to the Dean.' : 'Approval sends this request to the Head of Maintenance.'}</p>}
      {config.kind === 'arrangements' && <p className="form-hint">This sends the work back to the assigned technician to complete and report actual time and materials.</p>}
      {config.kind === 'verification' && <><label className="verification-confirmation"><input type="checkbox" required checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> I checked the completed work, actual time, and material usage.</label><p className="form-hint">Confirming closes this request and notifies the staff member and technician. Outstanding parts requests must be processed first.</p></>}
    </form>
  </Modal>;
};
