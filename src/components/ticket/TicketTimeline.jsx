import React from 'react';
import { CheckCircle2, Clock, AlertCircle, CircleDot } from 'lucide-react';

const WORKFLOW_STEPS = [
  "Submitted",
  "Department Review",
  "Approved",
  "Assigned",
  "Inspection",
  "In Progress",
  "Repair Completed",
  "Resolved"
];

export const TicketTimeline = ({ timeline = [], currentStatus = "Submitted" }) => {
  // Determine completed steps index
  const isRejected = currentStatus === "Rejected";

  return (
    <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-brand-text mb-6 flex items-center justify-between">
        <span>Maintenance Lifecycle</span>
        <span className="text-xs font-normal text-brand-text-secondary">
          {timeline.length} milestone{timeline.length > 1 ? 's' : ''} recorded
        </span>
      </h3>

      {isRejected ? (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <div>
            <span className="font-semibold block text-sm">Request Rejected</span>
            <span>This maintenance request was reviewed and declined by Department Administration.</span>
          </div>
        </div>
      ) : (
        <div className="relative pl-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {timeline.map((event, index) => {
            const isLast = index === timeline.length - 1;
            return (
              <div key={index} className="relative pb-6 last:pb-1">
                {/* Node indicator */}
                <div
                  className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                    isLast
                      ? 'border-brand-blue text-brand-blue ring-4 ring-blue-50'
                      : 'border-emerald-500 text-emerald-500'
                  }`}
                >
                  {isLast ? (
                    <CircleDot className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="text-xs font-semibold text-brand-text flex items-center gap-2">
                    <span>{event.status}</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      • {event.actor}
                    </span>
                  </div>
                  <time className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </time>
                </div>

                {event.note && (
                  <p className="mt-1 text-xs text-slate-600 bg-slate-50 border border-slate-100 p-2 rounded-md">
                    {event.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
