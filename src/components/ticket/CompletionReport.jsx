import React from 'react';
import { workDuration } from '../../utils/workDuration';

export const CompletionReport = ({ ticket }) => {
  const report = ticket.completionReport;
  if (!report) return null;
  const planned = ticket.arrangementMaterials || [];
  const used = report.materials || [];
  const ids = [...new Set([...planned, ...used].map((item) => String(item.itemId)))];
  return <div className="completion-report">
    <h2>Technician completion report</h2>
    <p className="whitespace-pre-wrap">{report.details}</p>
    <dl className="inspection-report"><dt>Actual work time</dt><dd>{workDuration(report.actualTimeMinutes)}</dd><dt>Inspection estimate</dt><dd>{ticket.inspectionReport?.estimatedTimeHours ?? '—'} hours</dd><dt>Report submitted</dt><dd>{report.submittedAt}</dd></dl>
    <h3>Material usage</h3>
    {ids.length ? <table className="material-usage-table"><thead><tr><th>Material</th><th>Arranged</th><th>Used</th></tr></thead><tbody>{ids.map((id) => {
      const arrangement = planned.find((item) => String(item.itemId) === id);
      const actual = used.find((item) => String(item.itemId) === id);
      const item = actual || arrangement;
      return <tr key={id}><th scope="row">{item.name}<small>{item.unit}</small></th><td>{arrangement?.quantity ?? 0}</td><td>{actual?.quantity ?? 0}</td></tr>;
    })}</tbody></table> : <p>No inventory materials used.</p>}
    {report.materialNotes && <p className="whitespace-pre-wrap">{report.materialNotes}</p>}
    {ticket.supervisorReview && <div className="inspection-summary supervisor-verification"><strong>Supervisor rating: {ticket.supervisorReview.rating}/5</strong><p>{ticket.supervisorReview.remarks}</p><p>Checked by {ticket.supervisorReview.supervisorName} · {ticket.supervisorReview.reviewedAt}</p></div>}
  </div>;
};
