import React, { useState } from 'react';
import {
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  ArrowLeft,
  Wrench,
  Building,
  Calendar,
  Search,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';

export const StaffDashboard = ({ onNavigate, onSelectTicket }) => {
  const { currentUser } = useAuth();
  const { tickets } = useTickets();

  // Selected ticket for the signature dual-panel view
  const [selectedId, setSelectedId] = useState('MRS-2026-0148');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [tabFilter, setTabFilter] = useState('In Progress');

  const selectedTicket = tickets.find((t) => t.id === selectedId) || tickets[0];

  // Calculations
  const urgentCount = tickets.filter((t) => (t.priority === 'Urgent' || t.priority === 'High') && t.status !== 'Resolved').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress' || t.status === 'Assigned' || t.status === 'Inspection').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Completed').length;
  const pendingCount = tickets.filter((t) => t.status === 'Submitted' || t.status === 'Pending Review').length;

  // Filtered ticket queue for the left white panel
  const queueTickets = tickets.filter((t) => {
    if (tabFilter === 'In Progress' && !['In Progress', 'Assigned', 'Inspection', 'Awaiting Parts'].includes(t.status)) return false;
    if (tabFilter === 'Pending' && !['Submitted', 'Pending Review'].includes(t.status)) return false;
    if (tabFilter === 'Resolved' && !['Resolved', 'Completed', 'Repair Completed'].includes(t.status)) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Page Title & Action Bar (Matching the screenshot: ← Invoices ... + Create) */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('requests')}
            className="w-8 h-8 rounded-full bg-[#131926] border border-[#1F293D] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Maintenance Requests
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              University of Vavuniya • Facility Management Dashboard
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('create_request')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#131926] hover:bg-[#1A2234] border border-[#2A364F] hover:border-[#a3e635] text-white text-xs font-semibold rounded-full shadow-card transition-all group"
        >
          <Plus className="w-4 h-4 text-[#a3e635] transition-transform group-hover:rotate-90" />
          <span>Create Request</span>
        </button>
      </div>

      {/* 2. Top Dark Cards Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Dark Card (2 cols) */}
        <div className="lg:col-span-2 bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card flex flex-col justify-between">
          <div className="grid grid-cols-3 gap-4 pb-6 border-b border-[#1F293D]/70">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Urgent / SLA Overdue
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {urgentCount} <span className="text-sm font-normal text-rose-400">Issues</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Due within next 24h
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {inProgressCount} <span className="text-sm font-normal text-slate-400">Active</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Average turnaround
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                12.4 <span className="text-sm font-normal text-slate-400">hours</span>
              </div>
            </div>
          </div>

          {/* Timeline Milestones with Lime Accent Lines and Avatars */}
          <div className="pt-6">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
              <span>Semester Start (Jul)</span>
              <span>Mid Term (Aug)</span>
              <span className="text-[#a3e635] font-bold">Exam Month (Sep)</span>
              <span>Finals (Oct)</span>
            </div>

            {/* Neon lime progress line */}
            <div className="w-full h-1.5 bg-[#1F293D] rounded-full overflow-hidden flex gap-1">
              <div className="h-full bg-[#bbf246] rounded-full w-1/4" />
              <div className="h-full bg-[#bbf246] rounded-full w-1/4" />
              <div className="h-full bg-[#bbf246] rounded-full w-1/4 shadow-[0_0_10px_rgba(187,242,70,0.8)]" />
              <div className="h-full bg-[#1F293D] rounded-full w-1/4" />
            </div>

            {/* Avatar Stacks underneath */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex -space-x-2">
                {['NP', 'SK', 'RT', 'KV'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-[#131926] text-[10px] font-bold text-white flex items-center justify-center shadow-sm"
                  >
                    {initials}
                  </div>
                ))}
              </div>

              <div className="flex -space-x-2">
                {['KS', 'TR', 'SW'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-900 to-slate-800 border-2 border-[#131926] text-[10px] font-bold text-blue-200 flex items-center justify-center shadow-sm"
                  >
                    {initials}
                  </div>
                ))}
              </div>

              <div className="flex -space-x-2">
                {['MF', 'JD'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-900 to-slate-800 border-2 border-[#131926] text-[10px] font-bold text-emerald-200 flex items-center justify-center shadow-sm"
                  >
                    {initials}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Dark Card: Available Fleet & Fast Dispatch */}
        <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">
                Available Fleet Capacity
              </span>
              <span className="text-[10px] font-mono font-bold text-[#a3e635]">92.4% On Duty</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              5 Technicians
            </div>
          </div>

          {/* 3 Specialized Trade Pills */}
          <div className="grid grid-cols-3 gap-2 my-4">
            <div className="p-2.5 rounded-xl bg-[#0E131E] border border-[#1F293D] text-center">
              <span className="text-[10px] font-mono text-slate-500 block">#4443</span>
              <span className="text-xs font-semibold text-slate-300">Electrical</span>
            </div>
            {/* The signature lime badge from reference image! */}
            <div className="p-2.5 rounded-xl bg-[#bbf246] text-[#020617] text-center font-bold shadow-[0_0_16px_rgba(187,242,70,0.5)]">
              <span className="text-[10px] font-mono text-[#020617] block opacity-80">#177210</span>
              <span className="text-xs">HVAC Cool</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0E131E] border border-[#1F293D] text-center">
              <span className="text-[10px] font-mono text-slate-500 block">#711221</span>
              <span className="text-xs font-semibold text-slate-300">Plumbing</span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => onNavigate('requests')}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-[#020617] text-xs font-bold rounded-full transition-all text-center shadow-sm"
            >
              Dispatch Work Order
            </button>
          </div>
        </div>
      </div>

      {/* 3. Active Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131926] p-3 rounded-2xl border border-[#1F293D]">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Active filters count badge */}
          <span className="px-3 py-1.5 rounded-full bg-[#0E131E] border border-[#1F293D] text-white font-semibold flex items-center gap-1.5">
            <span>Active filters</span>
            <span className="w-4 h-4 rounded-full bg-[#bbf246] text-[#020617] text-[10px] font-bold flex items-center justify-center">
              2
            </span>
          </span>

          {/* Filter Pills */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-[#0E131E] border border-[#1F293D] text-slate-300 text-xs outline-none cursor-pointer hover:border-slate-600"
          >
            <option value="All" className="bg-[#0E131E] text-white">All Categories</option>
            <option className="bg-[#0E131E] text-white">Air Conditioning</option>
            <option className="bg-[#0E131E] text-white">Electrical</option>
            <option className="bg-[#0E131E] text-white">Plumbing & Water</option>
            <option className="bg-[#0E131E] text-white">IT Infrastructure</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-[#0E131E] border border-[#1F293D] text-slate-300 text-xs outline-none cursor-pointer hover:border-slate-600"
          >
            <option value="All" className="bg-[#0E131E] text-white">All Priorities</option>
            <option className="bg-[#0E131E] text-white">Urgent</option>
            <option className="bg-[#0E131E] text-white">High</option>
            <option className="bg-[#0E131E] text-white">Medium</option>
          </select>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E131E] border border-[#1F293D] text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>September 2026</span>
          </div>
        </div>

        {/* Search input pill */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search request #..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#0E131E] border border-[#1F293D] rounded-full text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#a3e635]"
          />
        </div>
      </div>

      {/* 4. Signature Dual-Panel Section (High Contrast White Card on Left, Dark Card on Right) */}
      <div className="space-y-3">
        {/* Top tab pills */}
        <div className="flex items-center gap-2 pl-2">
          {['All Tickets', 'Pending', 'In Progress'].map((tab) => {
            const isTabActive = tabFilter === tab;
            const count = tab === 'All Tickets' ? tickets.length : tab === 'Pending' ? pendingCount : inProgressCount;
            return (
              <button
                key={tab}
                onClick={() => setTabFilter(tab)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                  isTabActive
                    ? 'bg-[#bbf246] text-[#020617] shadow-[0_0_16px_rgba(187,242,70,0.5)]'
                    : 'bg-[#131926] text-slate-300 border border-[#1F293D] hover:text-white'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${isTabActive ? 'bg-[#020617] text-white' : 'bg-white/10 text-slate-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dual-Panel Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT PANEL: High Contrast Clean White Card */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-3xl p-5 shadow-card-hover border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {tabFilter} Maintenance Queue
              </h3>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {queueTickets.length} tickets
              </span>
            </div>

            {/* List of queue items */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {queueTickets.map((t) => {
                const isSelected = selectedId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#0B0F17] text-white shadow-xl ring-2 ring-[#a3e635]/60 border border-[#a3e635]/40'
                        : 'bg-slate-50/80 hover:bg-slate-100 text-slate-900 border border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isSelected
                            ? 'bg-[#bbf246] text-[#020617] shadow-[0_0_10px_rgba(187,242,70,0.6)]'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {t.requester.name.slice(0, 2)}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono text-xs font-bold ${
                              isSelected ? 'text-[#a3e635]' : 'text-slate-950 font-extrabold'
                            }`}
                          >
                            #{t.id.replace('MRS-2026-', '')}
                          </span>
                          <span className={`text-[10px] font-medium ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                            • in 2 days
                          </span>
                        </div>
                        <div
                          className={`text-xs truncate font-semibold mt-0.5 ${
                            isSelected ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {t.title}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold block mb-1 ${
                          isSelected
                            ? 'bg-[#bbf246]/20 text-[#a3e635] border border-[#a3e635]/40'
                            : 'bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {t.status}
                      </span>
                      <span
                        className={`font-mono text-xs font-bold ${
                          isSelected ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {t.priority === 'Urgent' ? '4.0 hrs' : t.priority === 'High' ? '12.0 hrs' : '24.0 hrs'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: Deep Dark Luxury Details Card */}
          <div className="lg:col-span-7 bg-[#131926] text-white rounded-3xl p-6 border border-[#1F293D] shadow-card flex flex-col justify-between space-y-6">
            {/* Header: Ticket details + Faculty + Requester */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#1F293D]">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                  Ticket Details
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-mono text-white tracking-tight">
                    #{selectedTicket.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1F293D] text-[#a3e635] border border-[#a3e635]/40">
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Department pill */}
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                  Faculty & Department
                </span>
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <Building className="w-4 h-4 text-[#a3e635]" />
                  <span>{selectedTicket.department}</span>
                </div>
              </div>

              {/* Requester Profile */}
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                  Requester
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-[#a3e635] font-bold text-xs flex items-center justify-center">
                    {selectedTicket.requester.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{selectedTicket.requester.name}</div>
                    <div className="text-[10px] text-slate-400">{selectedTicket.requester.role}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Metric Sub-Cards with diagonal arrows (↗) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F293D] hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-semibold">
                  <span>Estimated Labor</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#a3e635]" />
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  12.0 hrs
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Diagnostic & repair</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F293D] hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-semibold">
                  <span>Stores Requisition</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#a3e635]" />
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {selectedTicket.itemRequests?.length || 2} items
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Central stores stock</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F293D] hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-semibold">
                  <span>SLA Countdown</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#a3e635]" />
                </div>
                <div className="text-xl font-bold text-[#a3e635] font-mono">
                  {selectedTicket.slaDue.split(' ')[0]}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">On target schedule</span>
              </div>
            </div>

            {/* Fault Summary Description */}
            <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F293D] text-xs space-y-1">
              <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                Location & Issue Context:
              </div>
              <p className="text-white leading-relaxed font-semibold">
                {selectedTicket.room} ({selectedTicket.building}) — {selectedTicket.title}
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px] pt-1">
                {selectedTicket.description}
              </p>
            </div>

            {/* Bottom Bar: Totals + Neon Lime Action Button */}
            <div className="pt-4 border-t border-[#1F293D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="grid grid-cols-3 gap-6 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Sub Category</span>
                  <span className="text-sm font-bold text-white">{selectedTicket.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Priority</span>
                  <span className="text-sm font-bold text-[#a3e635]">{selectedTicket.priority}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Assigned</span>
                  <span className="text-sm font-bold text-white truncate block max-w-[120px]">
                    {selectedTicket.assignedTo?.name || 'Central Dispatch'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTicket(selectedTicket.id)}
                  className="p-2.5 rounded-full bg-[#0E131E] border border-[#1F293D] hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="Full View"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectTicket(selectedTicket.id)}
                  className="px-6 py-2.5 bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] text-xs font-extrabold rounded-full shadow-[0_0_20px_rgba(187,242,70,0.45)] transition-all flex items-center gap-2"
                >
                  <span>Open Work Order</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
