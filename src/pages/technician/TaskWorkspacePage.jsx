import React, { useState } from 'react';
import { ArrowLeft, ClipboardCheck, MapPin } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { StatusBadge } from '../../components/common/Badge';
import { MaterialSelector } from '../../components/ticket/MaterialSelector';
import { CompletionReport } from '../../components/ticket/CompletionReport';
import { nextStep } from '../../utils/requestHelpers';

const WorkCompletionForm = ({ ticket }) => {
  const { workflowAction } = useTickets();
  const [details, setDetails] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('0');
  const [materials, setMaterials] = useState(() => (ticket.arrangementMaterials || []).map((item) => ({ ...item, itemId: String(item.itemId), quantity: 0 })));
  const [materialNotes, setMaterialNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    const actualTimeMinutes = Number(hours) * 60 + Number(minutes);
    if (!Number.isInteger(actualTimeMinutes) || actualTimeMinutes <= 0 || actualTimeMinutes > 600000) { setError('Enter the actual work time, from 1 minute to 10,000 hours.'); return; }
    setBusy(true); setError('');
    try { await workflowAction('completionReport', ticket.id, { details: details.trim(), actualTimeMinutes, materials, materialNotes: materialNotes.trim() }); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  };
  return <>
    <section className="ui-panel help-panel"><h2>Materials from supervisor</h2>{ticket.arrangementMaterials?.length > 0 ? <dl className="inspection-report"><dt>Confirmed materials</dt>{ticket.arrangementMaterials.map((item) => <dd key={item.itemId}>{item.name}: {item.quantity} {item.unit}</dd>)}</dl> : <p>The supervisor confirmed that no inventory materials are needed.</p>}<p className="mt-4">Your work is ready to proceed. Complete it, then report the actual time and quantities used. The supervisor will check and rate it.</p></section>
    <form className="ui-panel request-form form-fields" id="completion-report-form" onSubmit={submit}>
      <div className="form-section-heading"><h2>Work completion report</h2><p>Report actual results, including any materials left unused.</p></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <fieldset disabled={busy} className="form-fields">
        <label htmlFor="completed-work">What work did you complete? *<textarea id="completed-work" required rows={5} maxLength={5000} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Describe the repairs, checks performed, and final result." /></label>
        <fieldset><legend>Actual time spent *</legend><div className="actual-time-fields"><label htmlFor="actual-hours">Hours<input id="actual-hours" type="number" min="0" max="10000" step="1" required value={hours} onChange={(event) => { setHours(event.target.value); setError(''); }} /></label><label htmlFor="actual-minutes">Minutes<input id="actual-minutes" type="number" min="0" max="59" step="1" required value={minutes} onChange={(event) => { setMinutes(event.target.value); setError(''); }} /></label></div></fieldset>
        <MaterialSelector value={materials} onChange={setMaterials} usage />
        <label htmlFor="material-usage-notes">Material usage notes (optional)<textarea id="material-usage-notes" rows={3} maxLength={5000} value={materialNotes} onChange={(event) => setMaterialNotes(event.target.value)} placeholder="Record other materials used or explain unused items." /></label>
      </fieldset>
      <div className="form-actions"><span className="form-hint">The supervisor will check your report before closing this request.</span><button type="submit" disabled={busy} className="ui-button primary">{busy ? 'Submitting…' : 'Submit completion report'}</button></div>
    </form>
  </>;
};

export const TaskWorkspacePage = ({ ticketId, onBack }) => {
  const { tickets, workflowAction, reload } = useTickets();
  const ticket = tickets.find((item) => item.id === ticketId);
  const [details, setDetails] = useState('');
  const [materials, setMaterials] = useState('');
  const [materialItems, setMaterialItems] = useState([]);
  const [hours, setHours] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  if (!ticket) return <section className="ui-panel friendly-empty"><h1>Select a maintenance task</h1><p>Open an assigned request from My tasks to start.</p><button className="ui-button secondary" onClick={onBack}>Back to my tasks</button></section>;
  const submit = async (event) => {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError('');
    try { await workflowAction('inspection', ticket.id, { issueType: ticket.category, details: details.trim(), requiredMaterials: materials.trim(), materials: materialItems, estimatedTimeHours: Number(hours) }); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  };
  return <div className="portal-page form-page">
    <div className="button-group justify-between"><button className="text-action" onClick={onBack}><ArrowLeft size={17} /> Back to my tasks</button><button className="ui-button secondary" disabled={refreshing} onClick={async () => { setRefreshing(true); try { await reload(); } finally { setRefreshing(false); } }}>{refreshing ? 'Checking…' : 'Refresh status'}</button></div>
    <div className="page-heading"><div><p className="eyebrow">{ticket.workflowStatus === 'TECHNICIAN_ASSIGNED' ? 'TECHNICIAN INSPECTION' : 'TECHNICIAN WORK'}</p><h1>{ticket.title}</h1><p>{ticket.id}</p></div><StatusBadge status={ticket.status} /></div>
    <section className="ui-panel help-panel"><h2><MapPin size={20} className="inline mr-2" /> Location & reported problem</h2><p>{ticket.room}, {ticket.floor}, {ticket.building}</p><p>{ticket.locationNotes}</p><p className="whitespace-pre-wrap mt-4">{ticket.description}</p></section>
    {ticket.workflowStatus === 'TECHNICIAN_ASSIGNED' ? <form className="ui-panel request-form form-fields" onSubmit={submit}>
      <div className="form-section-heading"><h2><ClipboardCheck size={21} className="inline mr-2" /> Inspection report</h2><p>Record what you found. The supervisor will use this report to arrange the work.</p></div>
      {error && <p role="alert" className="form-error">{error}</p>}
      <label htmlFor="inspection-findings">What did you find? *<textarea id="inspection-findings" required rows={5} maxLength={5000} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Describe the problem, its cause, and the recommended work." /></label>
      <MaterialSelector value={materialItems} onChange={setMaterialItems} disabled={busy} />
      <label htmlFor="inspection-materials">Other materials or arrangement notes (optional)<textarea id="inspection-materials" rows={3} maxLength={5000} value={materials} onChange={(event) => setMaterials(event.target.value)} placeholder="Describe any items not in the list, equipment, or access arrangements." /></label>
      <label htmlFor="inspection-hours">Estimated work time in hours *<input id="inspection-hours" type="number" min="0.25" step="0.25" max="10000" required value={hours} onChange={(event) => setHours(event.target.value)} /></label>
      <div className="form-actions"><span className="form-hint">The report goes to the assigned supervisor.</span><button type="submit" disabled={busy} className="ui-button primary">{busy ? 'Sending…' : 'Send inspection report'}</button></div>
    </form> : ticket.workflowStatus === 'ARRANGEMENTS_IN_PROGRESS' ? <WorkCompletionForm key={ticket.id} ticket={ticket} /> : ticket.completionReport ? <section className="ui-panel help-panel"><p className="eyebrow">{ticket.supervisorReview ? 'WORK VERIFIED' : 'REPORT SENT — AWAITING SUPERVISOR CHECK'}</p><CompletionReport ticket={ticket} /></section> : <section className="ui-panel help-panel"><h2>{ticket.workflowStatus === 'INSPECTION_COMPLETED' ? 'Inspection report sent' : ticket.status}</h2><p>{ticket.inspectionReport?.details || 'This request has moved beyond the inspection stage.'}</p><p>Materials: {ticket.inspectionReport?.requiredMaterials || 'None listed'}</p><p>Estimated work: {ticket.inspectionReport?.estimatedTimeHours || '—'} hours</p><p className="mt-4">{nextStep(ticket)}</p></section>}
  </div>;
};
