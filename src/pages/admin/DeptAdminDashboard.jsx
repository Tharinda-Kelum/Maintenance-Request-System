import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  UserCheck,
  FileText,
  ChevronRight,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { ReviewTicketDrawer } from './ReviewTicketDrawer';
import { AssignTechnicianModal } from './AssignTechnicianModal';

export const DeptAdminDashboard = ({ onNavigate, onSelectTicket }) => {
  const { tickets } = useTickets();
  const { currentUser } = useAuth();

  const [selectedTicketForReview, setSelectedTicketForReview] = useState(null);
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState(null);

  // Department requests
  const pendingReviewTickets = tickets.filter(
    (t) => t.status === 'Submitted' || t.status === 'Pending Review'
  );
  const approvedToday = tickets.filter((t) => t.status === 'Approved').length;
  const highPriorityTickets = tickets.filter((t) => (t.priority === 'High' || t.priority === 'Urgent') && t.status !== 'Resolved' && t.status !== 'Completed').length;
  const unassignedCount = tickets.filter((t) => !t.assignedTo && t.status !== 'Rejected' && t.status !== 'Resolved').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress' || t.status === 'Assigned' || t.status === 'Inspection').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Completed').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131926] p-6 rounded-2xl border border-[#1F293D] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a3e635]">
              Department Operations • {currentUser.department}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Department Maintenance Review
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify academic facility maintenance requests, prioritize emergency work orders, and assign specialized technicians.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('requests')}
            className="px-3.5 py-2 text-xs font-semibold rounded-full border border-[#1F293D] bg-[#0E131E] hover:bg-white/5 text-slate-200 transition-colors"
          >
            All Dept Work Orders
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 text-xs font-bold rounded-full bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] shadow-[0_0_16px_rgba(187,242,70,0.4)] transition-colors"
          >
            View Dept Reports
          </button>
        </div>
      </div>

      {/* Top Operational KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Pending Review"
          value={pendingReviewTickets.length}
          subtitle="Awaiting HOD check"
          icon={Clock}
          active={pendingReviewTickets.length > 0}
        />
        <StatCard
          title="Approved Today"
          value={approvedToday}
          subtitle="Ready for dispatch"
          icon={CheckCircle2}
        />
        <StatCard
          title="Urgent / High"
          value={highPriorityTickets}
          subtitle="High priority SLA"
          icon={AlertTriangle}
        />
        <StatCard
          title="Unassigned"
          value={unassignedCount}
          subtitle="Needs technician"
          icon={UserCheck}
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Active on campus"
          icon={Wrench}
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          subtitle="This semester"
          icon={CheckCircle2}
        />
      </div>

      {/* Incoming Verification Queue Table */}
      <div className="bg-[#131926] rounded-2xl border border-[#1F293D] shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1F293D] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Incoming Requests Verification Queue</span>
              <span className="text-[11px] font-bold bg-[#bbf246]/15 text-[#a3e635] border border-[#a3e635]/30 px-2.5 py-0.5 rounded-full font-mono">
                {pendingReviewTickets.length} Pending
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review issues submitted by faculty staff before maintenance squad dispatch.
            </p>
          </div>
        </div>

        {pendingReviewTickets.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-[#a3e635] mx-auto mb-2" />
            <p className="font-semibold text-white">Verification queue is completely clear!</p>
            <p className="text-slate-400 mt-0.5">All incoming departmental requests have been reviewed and dispatched.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0E131E] border-b border-[#1F293D] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Issue Description</th>
                  <th className="py-3 px-4">Requester</th>
                  <th className="py-3 px-4">Room / Building</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293D]/70">
                {pendingReviewTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-[#182132]/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#a3e635] whitespace-nowrap">
                      {t.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-white truncate">{t.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{t.description}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-white">{t.requester.name}</div>
                      <div className="text-[10px] text-slate-400">{t.requester.role}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-200">{t.room}</div>
                      <div className="text-[10px] text-slate-400">{t.building}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-[#182132] border border-[#1F293D] text-slate-200 font-medium text-[11px]">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={t.priority} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setSelectedTicketForReview(t)}
                        className="px-3.5 py-1.5 bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-[0_0_14px_rgba(187,242,70,0.35)]"
                      >
                        <span>Review & Verify</span>
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Second Section: Active Department Work Orders */}
      <div className="bg-[#131926] rounded-2xl border border-[#1F293D] shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1F293D] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Active Department Work Orders</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Approved maintenance jobs currently in diagnosis, parts acquisition, or repair
            </p>
          </div>
          <button
            onClick={() => onNavigate('requests')}
            className="text-xs font-bold text-[#a3e635] hover:underline"
          >
            All Work Orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0E131E] border-b border-[#1F293D] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Issue</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Specialist</th>
                <th className="py-3 px-4 text-right">Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F293D]/70">
              {tickets.slice(0, 6).map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onSelectTicket(t.id)}
                  className="hover:bg-[#182132]/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#a3e635] whitespace-nowrap">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white truncate max-w-[200px]">
                    {t.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    {t.room}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <PriorityBadge priority={t.priority} size="xs" />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={t.status} size="xs" />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {t.assignedTo ? (
                      <span className="font-medium text-white">{t.assignedTo.name}</span>
                    ) : (
                      <span className="text-amber-400 font-semibold">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedTicketForAssign(t)}
                      className="px-2.5 py-1 text-[11px] font-medium border border-[#1F293D] hover:bg-[#182132] rounded-lg text-slate-300 transition-colors"
                    >
                      {t.assignedTo ? 'Change Tech' : 'Assign'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Drawer */}
      {selectedTicketForReview && (
        <ReviewTicketDrawer
          isOpen={Boolean(selectedTicketForReview)}
          onClose={() => setSelectedTicketForReview(null)}
          ticket={selectedTicketForReview}
          onAssignAfterApprove={(t) => setSelectedTicketForAssign(t)}
        />
      )}

      {/* Assign Technician Modal */}
      {selectedTicketForAssign && (
        <AssignTechnicianModal
          isOpen={Boolean(selectedTicketForAssign)}
          onClose={() => setSelectedTicketForAssign(null)}
          ticket={selectedTicketForAssign}
        />
      )}
    </div>
  );
};
