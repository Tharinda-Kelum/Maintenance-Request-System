import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Share2,
  Printer,
  ShieldCheck,
  Send,
  XOctagon
} from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { TicketTimeline } from '../../components/ticket/TicketTimeline';
import { TicketActivityFeed } from '../../components/ticket/TicketActivityFeed';
import { AttachmentGallery, SLAIndicator } from '../../components/ticket/AttachmentGallery';
import { Modal } from '../../components/common/Modal';

export const RequestDetailPage = ({ ticketId, onBack, onOpenAssign, onOpenReview }) => {
  const { tickets, confirmResolution } = useTickets();
  const { currentUser, activeRoleId } = useAuth();
  const { showToast } = useToast();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState('');

  const ticket = tickets.find((t) => t.id === ticketId) || tickets[0];

  if (!ticket) {
    return (
      <div className="text-center py-16 bg-[#131926] rounded-2xl border border-[#1F293D] p-8">
        <h3 className="text-base font-bold text-white">Ticket Not Found</h3>
        <p className="text-xs text-slate-400 mt-1">The requested maintenance record does not exist.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#bbf246] text-[#020617] rounded-full text-xs font-bold"
        >
          Return to List
        </button>
      </div>
    );
  }

  const handleSignOff = () => {
    confirmResolution(ticket.id, currentUser.name);
    setShowConfirmModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131926] p-5 rounded-2xl border border-[#1F293D] shadow-card">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full text-slate-400 hover:text-white bg-[#0E131E] border border-[#1F293D] hover:bg-[#1A2234] transition-colors"
            title="Go back to list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#a3e635]">
                {ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white mt-1">
              {ticket.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-full border border-[#1F293D] bg-[#0E131E] text-slate-300 hover:text-white hover:bg-[#1A2234] text-xs flex items-center gap-1.5 transition-colors"
            title="Print Job Card"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Job Card</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description Card */}
          <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Reported Issue Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {ticket.description}
            </p>

            {/* Quick Metadata Pill Grid */}
            <div className="mt-6 pt-4 border-t border-[#1F293D] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Category</span>
                <span className="font-semibold text-white">{ticket.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Logged On</span>
                <span className="font-medium text-white">{ticket.submittedAt}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Facility Room</span>
                <span className="font-medium text-white truncate block">{ticket.room}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Target SLA</span>
                <span className="font-mono font-medium text-[#a3e635]">{ticket.slaDue}</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Notes (if any) */}
          {ticket.diagnosisNotes && (
            <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-4 h-4 text-[#a3e635]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Technician Diagnostic Findings
                </h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed bg-[#0E131E] p-3.5 rounded-xl border border-[#1F293D] font-mono">
                {ticket.diagnosisNotes}
              </p>
            </div>
          )}

          {/* Attachments / Photos Gallery */}
          <AttachmentGallery attachments={ticket.attachments} />

          {/* Maintenance Lifecycle Timeline */}
          <TicketTimeline timeline={ticket.timeline} currentStatus={ticket.status} />

          {/* Activity Feed & Remarks */}
          <TicketActivityFeed ticket={ticket} />
        </div>

        {/* Right / Sidebar Column (1 span) */}
        <div className="space-y-6">
          {/* Quick Status & SLA Card */}
          <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-5 shadow-card space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ticket Operations & SLA
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#1F293D]">
                <span className="text-slate-400">Current Lifecycle:</span>
                <StatusBadge status={ticket.status} size="xs" />
              </div>
              <div className="flex justify-between py-1 border-b border-[#1F293D]">
                <span className="text-slate-400">Service Priority:</span>
                <PriorityBadge priority={ticket.priority} size="xs" />
              </div>
              <div className="flex justify-between py-1 border-b border-[#1F293D]">
                <span className="text-slate-400">Resolution SLA:</span>
                <span className="font-mono text-white font-semibold">{ticket.slaDue}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Last System Update:</span>
                <span className="font-mono text-slate-400 text-[11px]">{ticket.lastUpdated}</span>
              </div>
            </div>

            {/* Contextual Actions by Role */}
            <div className="pt-3 border-t border-[#1F293D] space-y-2">
              {/* If user is requester and status is Repair Completed */}
              {(ticket.status === 'Repair Completed' || ticket.status === 'In Progress') && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Work & Sign Off</span>
                </button>
              )}

              {/* If Dept Admin: verify or re-assign */}
              {(activeRoleId === 'dept_admin' || activeRoleId === 'super_admin') && (
                <div className="space-y-2">
                  <button
                    onClick={() => onOpenAssign && onOpenAssign(ticket)}
                    className="w-full py-2 px-3 bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(187,242,70,0.3)]"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{ticket.assignedTo ? 'Re-assign Technician' : 'Assign Technician'}</span>
                  </button>
                  {ticket.status === 'Pending Review' && (
                    <button
                      onClick={() => onOpenReview && onOpenReview(ticket)}
                      className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-full transition-colors"
                    >
                      Conduct Department Review
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Assigned Technician Card */}
          <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-5 shadow-card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Assigned Maintenance Team
            </h4>
            {ticket.assignedTo ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0E131E] border border-[#1F293D] text-[#a3e635] font-bold text-xs flex items-center justify-center">
                    {ticket.assignedTo.name.slice(0, 2)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{ticket.assignedTo.name}</h5>
                    <p className="text-[11px] text-slate-400">{ticket.assignedTo.trade}</p>
                  </div>
                </div>
                <div className="p-3 bg-[#0E131E] rounded-xl text-xs space-y-1.5 border border-[#1F293D]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{ticket.assignedTo.phone}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Assigned via Central Works Division Dispatch
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-4 bg-[#0E131E] rounded-xl border border-dashed border-[#1F293D]">
                No technician assigned yet. Department review pending.
              </div>
            )}
          </div>

          {/* Campus Facility & Location Card */}
          <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-5 shadow-card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Physical Location
            </h4>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Faculty</span>
                <span className="font-medium text-white">{ticket.faculty}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Building Complex</span>
                <span className="font-medium text-white">{ticket.building}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Floor & Room</span>
                <span className="font-semibold text-[#a3e635]">{ticket.room} ({ticket.floor})</span>
              </div>
              {ticket.department && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Department</span>
                  <span className="font-medium text-slate-300">{ticket.department}</span>
                </div>
              )}
            </div>
          </div>

          {/* Requester Contact Info */}
          <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-5 shadow-card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Requester Information
            </h4>
            <div className="space-y-1.5 text-xs">
              <p className="font-semibold text-white">{ticket.requester.name}</p>
              <p className="text-[11px] text-slate-400">{ticket.requester.role}</p>
              <p className="font-mono text-[11px] text-slate-300">{ticket.requester.email}</p>
              {ticket.requester.phone && (
                <p className="font-mono text-[11px] text-slate-400">{ticket.requester.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation & Rating Modal */}
      {showConfirmModal && (
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirm Work Completion"
          subtitle={`Ticket: ${ticket.id} - ${ticket.title}`}
          footer={
            <>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-[#1F293D] bg-[#0E131E] hover:bg-[#1A2234] text-xs font-semibold text-slate-300 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOff}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-sm"
              >
                Confirm & Sign Off
              </button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-300 leading-relaxed">
              By confirming, you certify that technician <strong>{ticket.assignedTo?.name}</strong> has inspected and addressed the fault at <strong>{ticket.room}</strong> and the equipment or room is now safe and functional.
            </p>

            <div>
              <label className="block font-semibold text-white mb-1.5">
                Service Satisfaction Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className={`w-9 h-9 rounded-xl border text-sm font-bold flex items-center justify-center transition-all ${
                      feedbackRating >= star
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-[#0E131E] text-slate-500 border-[#1F293D]'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-white mb-1.5">
                Optional Feedback Notes for Maintenance Unit
              </label>
              <textarea
                rows={3}
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                placeholder="e.g. Work was executed promptly and cleanly. Thanks!"
                className="w-full p-3 bg-[#0E131E] border border-[#1F293D] rounded-xl outline-none text-xs text-white"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
