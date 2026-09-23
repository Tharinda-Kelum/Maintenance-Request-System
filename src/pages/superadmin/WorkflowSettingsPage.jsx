import React, { useState } from 'react';
import { Sliders, Clock, AlertTriangle, Check, ShieldAlert, Save } from 'lucide-react';
import { PRIORITIES, CATEGORIES } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export const WorkflowSettingsPage = () => {
  const { showToast } = useToast();
  const [urgentSla, setUrgentSla] = useState(4);
  const [highSla, setHighSla] = useState(12);
  const [mediumSla, setMediumSla] = useState(24);
  const [lowSla, setLowSla] = useState(72);
  const [autoEscalate, setAutoEscalate] = useState(true);

  const handleSave = () => {
    showToast('Workflow SLAs and category routing saved successfully', 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-card border border-brand-border shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text">
            Workflow & SLA Configuration
          </h1>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Configure institutional Service Level Agreements (SLAs), auto-escalation triggers, and default trade squad assignment rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save SLA Policies</span>
        </button>
      </div>

      {/* Priority SLA Target Settings */}
      <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-brand-text">Priority Level Resolution Targets</h3>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Maximum turnaround hours before tickets trigger red-alert escalation to Department Head and Works Director.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
            <span className="font-bold text-rose-700 text-xs uppercase">Urgent Priority</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="24"
                value={urgentSla}
                onChange={(e) => setUrgentSla(parseInt(e.target.value) || 2)}
                className="w-20 p-2 text-sm font-bold font-mono border border-rose-300 rounded-lg outline-none bg-white text-center"
              />
              <span className="text-xs font-semibold text-slate-700">Hours</span>
            </div>
            <p className="text-[11px] text-slate-500">Hazards, flooding, blackout risks</p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
            <span className="font-bold text-amber-700 text-xs uppercase">High Priority</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="48"
                value={highSla}
                onChange={(e) => setHighSla(parseInt(e.target.value) || 12)}
                className="w-20 p-2 text-sm font-bold font-mono border border-amber-300 rounded-lg outline-none bg-white text-center"
              />
              <span className="text-xs font-semibold text-slate-700">Hours</span>
            </div>
            <p className="text-[11px] text-slate-500">Lecture hall, seminar, AC failure</p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
            <span className="font-bold text-blue-700 text-xs uppercase">Medium Priority</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="96"
                value={mediumSla}
                onChange={(e) => setMediumSla(parseInt(e.target.value) || 24)}
                className="w-20 p-2 text-sm font-bold font-mono border border-blue-300 rounded-lg outline-none bg-white text-center"
              />
              <span className="text-xs font-semibold text-slate-700">Hours</span>
            </div>
            <p className="text-[11px] text-slate-500">Standard office room defects</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="font-bold text-slate-700 text-xs uppercase">Low Priority</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="168"
                value={lowSla}
                onChange={(e) => setLowSla(parseInt(e.target.value) || 72)}
                className="w-20 p-2 text-sm font-bold font-mono border border-slate-300 rounded-lg outline-none bg-white text-center"
              />
              <span className="text-xs font-semibold text-slate-700">Hours</span>
            </div>
            <p className="text-[11px] text-slate-500">Cosmetic woodwork, minor touchups</p>
          </div>
        </div>
      </div>

      {/* Categories & Default Squad Routing */}
      <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-brand-text">Fault Categories & Responsible Squads</h3>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Default dispatch routing rules for incoming tickets
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-brand-border text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Responsible Maintenance Squad</th>
                <th className="py-3 px-4">Default First-Response SLA</th>
                <th className="py-3 px-4">Auto-Dispatch</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/70">
              {CATEGORIES.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-brand-text">
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {cat.squad}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-brand-blue font-semibold">
                    {cat.defaultSlaHours} hours
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                      Enabled
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-emerald-600 font-semibold">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
