import React, { useState } from 'react';
import { AlertOctagon, Search, Download, Filter, Shield } from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '../../data/adminData';
import { useToast } from '../../context/ToastContext';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const { showToast } = useToast();

  const filteredLogs = logs.filter((log) => {
    if (moduleFilter !== 'All' && log.module !== moduleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    showToast('Exporting security audit logs in encrypted format...', 'info');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-card border border-brand-border shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text">
            Security & System Audit Logs
          </h1>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Immutable audit trail of authentication events, maintenance status mutations, spare parts issuance, and administrative overrides.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-card border border-brand-border p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user, action, target ID, IP..."
            className="w-full pl-9 pr-3 py-2 text-xs text-brand-text bg-slate-50 border border-brand-border rounded-lg outline-none focus:bg-white focus:border-brand-blue"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-brand-border rounded-lg bg-white outline-none w-full sm:w-auto"
        >
          <option value="All">All Modules</option>
          <option>Requests</option>
          <option>Inventory</option>
          <option>Tasks</option>
          <option>Work Orders</option>
          <option>Workflow Settings</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-card border border-brand-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-brand-border text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Client IP / Device</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/70">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                    {log.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-brand-text">{log.user}</div>
                    <div className="text-[10px] text-slate-400">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] font-semibold text-brand-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                    {log.module}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800 whitespace-nowrap font-medium">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono text-slate-700 text-[11px]">{log.ip}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{log.device}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs leading-relaxed text-[11px]">
                    {log.details}
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
