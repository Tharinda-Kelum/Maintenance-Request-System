import React, { useState } from 'react';
import { Settings, Save, Shield, Server, Bell, Database } from 'lucide-react';
import { UNIVERSITY_INFO } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export const SystemSettingsPage = () => {
  const { showToast } = useToast();
  const [systemName, setSystemName] = useState(UNIVERSITY_INFO.systemName);
  const [campusHours, setCampusHours] = useState(UNIVERSITY_INFO.hours);
  const [emergencyHotline, setEmergencyHotline] = useState('+94 24 222 4211');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('University MRS configuration updated', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-card border border-brand-border shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text">
            System & Enterprise Settings
          </h1>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Configure campus system parameters, operational schedules, notification webhooks, and backup routines.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-brand-text">Institution Identity & Campus Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-brand-text mb-1">System Portal Title</label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full p-2.5 border border-brand-border rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-brand-text mb-1">Emergency Dispatch Hotline</label>
            <input
              type="text"
              value={emergencyHotline}
              onChange={(e) => setEmergencyHotline(e.target.value)}
              className="w-full p-2.5 border border-brand-border rounded-lg outline-none font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-semibold text-brand-text mb-1">Standard Operational Hours</label>
            <input
              type="text"
              value={campusHours}
              onChange={(e) => setCampusHours(e.target.value)}
              className="w-full p-2.5 border border-brand-border rounded-lg outline-none"
            />
          </div>
        </div>
      </div>

      {/* Notification Webhooks */}
      <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-brand-text">Automated Communication Triggers</h3>
        <div className="space-y-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded text-brand-blue"
            />
            <span>Send automated email updates to faculty when ticket status advances</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="rounded text-brand-blue"
            />
            <span>Send SMS dispatch alerts to on-duty technicians for Urgent priority calls</span>
          </label>
        </div>
      </div>

      {/* Backup & System Health */}
      <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-brand-text">Database & Disaster Recovery</h3>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Last Automated Snapshot:</span>
            <span className="font-mono text-brand-text font-semibold">Today, 03:00 AM (UTC+5:30)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Database Size:</span>
            <span className="font-mono text-brand-text font-semibold">48.2 MB (PostgreSQL 16)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Storage Cluster:</span>
            <span className="font-mono text-emerald-600 font-semibold">Campus On-Premise NAS Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
