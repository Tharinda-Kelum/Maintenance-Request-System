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
      <div className="text-center py-16 bg-white rounded-xl border border-brand-border p-8">
        <h3 className="text-base font-bold text-brand-text">Ticket Not Found</h3>
        <p className="text-xs text-brand-text-secondary mt-1">The requested maintenance record does not exist.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-semibold"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-card border border-brand-border shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-text hover:bg-slate-100 transition-colors"
            title="Go back to list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-blue">
                {ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-brand-text mt-0.5">
              {ticket.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs flex items-center gap-1.5"
            title="Print Job Card"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Job Card</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description Card */}
          <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary mb-3">
              Reported Issue Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {ticket.description}
            </p>

            {/* Quick Metadata Pill Grid */}
            <div className="mt-6 pt-4 border-t border-brand-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Category</span>
                <span className="font-semibold text-brand-text">{ticket.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Logged On</span>
                <span className="font-medium text-brand-text">{ticket.submittedAt}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Facility Room</span>
                <span className="font-medium text-brand-text truncate block">{ticket.room}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Target SLA</span>
                <span className="font-mono font-medium text-amber-700">{ticket.slaDue}</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Notes (if any) */}
          {ticket.diagnosisNotes && (
            <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-900">
                  Technician Diagnostic Findings
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-purple-50/50 p-3.5 rounded-lg border border-purple-100 font-mono">
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
          <div className="bg-white rounded-card border border-brand-border p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
              Ticket Operations & SLA
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Current Lifecycle:</span>
                <StatusBadge status={ticket.status} size="xs" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Service Priority:</span>
                <PriorityBadge priority={ticket.priority} size="xs" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Resolution SLA:</span>
                <span className="font-mono text-slate-800 font-semibold">{ticket.slaDue}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Last System Update:</span>
                <span className="font-mono text-slate-500 text-[11px]">{ticket.lastUpdated}</span>
              </div>
            </div>

            {/* Contextual Actions by Role */}
            <div className="pt-3 border-t border-brand-border space-y-2">
              {/* If user is requester and status is Repair Completed */}
              {(ticket.status === 'Repair Completed' || ticket.status === 'In Progress') && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
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
                    className="w-full py-2 px-3 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{ticket.assignedTo ? 'Re-assign Technician' : 'Assign Technician'}</span>
                  </button>
                  {ticket.status === 'Pending Review' && (
                    <button
                      onClick={() => onOpenReview && onOpenReview(ticket)}
                      className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Conduct Department Review
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Assigned Technician Card */}
          <div className="bg-white rounded-card border border-brand-border p-5 shadow-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary mb-3">
              Assigned Maintenance Team
            </h4>
            {ticket.assignedTo ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-brand-blue font-bold text-xs flex items-center justify-center">
                    {ticket.assignedTo.name.slice(0, 2)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-brand-text">{ticket.assignedTo.name}</h5>
                    <p className="text-[11px] text-slate-500">{ticket.assignedTo.trade}</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{ticket.assignedTo.phone}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Assigned via Central Works Division Dispatch
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed">
                No technician assigned yet. Department review pending.
              </div>
            )}
          </div>

          {/* Campus Facility & Location Card */}
          <div className="bg-white rounded-card border border-brand-border p-5 shadow-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary mb-3">
              Physical Location
            </h4>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Faculty</span>
                <span className="font-medium text-brand-text">{ticket.faculty}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Building Complex</span>
                <span className="font-medium text-brand-text">{ticket.building}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Floor & Room</span>
                <span className="font-semibold text-brand-blue">{ticket.room} ({ticket.floor})</span>
              </div>
              {ticket.department && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Department</span>
                  <span className="font-medium text-slate-700">{ticket.department}</span>
                </div>
              )}
            </div>
          </div>

          {/* Requester Contact Info */}
          <div className="bg-white rounded-card border border-brand-border p-5 shadow-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary mb-3">
              Requester Information
            </h4>
            <div className="space-y-1.5 text-xs">
              <p className="font-semibold text-brand-text">{ticket.requester.name}</p>
              <p className="text-[11px] text-slate-500">{ticket.requester.role}</p>
              <p className="font-mono text-[11px] text-slate-600">{ticket.requester.email}</p>
              {ticket.requester.phone && (
                <p className="font-mono text-[11px] text-slate-500">{ticket.requester.phone}</p>
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
                className="px-4 py-2 border border-slate-300 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOff}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Confirm & Sign Off
              </button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-700 leading-relaxed">
              By confirming, you certify that technician <strong>{ticket.assignedTo?.name}</strong> has inspected and addressed the fault at <strong>{ticket.room}</strong> and the equipment or room is now safe and functional.
            </p>

            <div>
              <label className="block font-semibold text-brand-text mb-1.5">
                Service Satisfaction Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className={`w-9 h-9 rounded-lg border text-sm font-bold flex items-center justify-center transition-all ${
                      feedbackRating >= star
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-brand-text mb-1.5">
                Optional Feedback Notes for Maintenance Unit
              </label>
              <textarea
                rows={3}
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                placeholder="e.g. Work was executed promptly and cleanly. Thanks!"
                className="w-full p-2.5 border border-brand-border rounded-lg outline-none text-xs"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
