import React from 'react';
import { Check, Clock } from 'lucide-react';
import { WORKFLOW_STEPS, workflowStage } from '../../utils/workflow';

export const WorkflowProgress = ({ ticket }) => {
  const stage = workflowStage(ticket.workflowStatus);
  const rejected = ticket.workflowStatus?.endsWith('REJECTED');
  return <section className="ui-panel help-panel workflow-progress">
    <h2>Request progress</h2>
    {rejected && <p className="form-error mt-4">{ticket.status}: {ticket.rejectionReason}</p>}
    <ol aria-label="Maintenance workflow">{WORKFLOW_STEPS.map((label, index) => <li key={label} className={index < stage || ticket.workflowStatus === 'COMPLETED' ? 'done' : index === stage ? 'current' : ''} aria-current={index === stage ? 'step' : undefined}>
      <span>{index < stage || ticket.workflowStatus === 'COMPLETED' ? <Check size={15} /> : index === stage ? <Clock size={15} /> : index + 1}</span><div>{label}{index === stage && !rejected && ticket.workflowStatus !== 'COMPLETED' && <small>Current step</small>}</div>
    </li>)}</ol>
  </section>;
};
