import React, { useState } from 'react';
import { Drawer } from '../../components/common/Drawer';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { PRIORITIES } from '../../data/mockData';

export const ReviewTicketDrawer = ({ isOpen, onClose, ticket, onAssignAfterApprove }) => {
  const { approveTicket, rejectTicket } = useTickets();
  const { currentUser } = useAuth();

  const [decision, setDecision] = useState('approve'); // 'approve' or 'reject'
  const [adjustedPriority, setAdjustedPriority] = useState(ticket?.priority || 'High');
  const [remarks, setRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  if (!ticket) return null;

  const handleConfirm = () => {
    if (decision === 'approve') {
      approveTicket(ticket.id, adjustedPriority, remarks, currentUser);
      onClose();
      if (onAssignAfterApprove) {
        onAssignAfterApprove(ticket);
      }
    } else {
      if (!rejectionReason.trim()) return;
      rejectTicket(ticket.id, rejectionReason, currentUser);
      onClose();
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Request: ${ticket.id}`}
      subtitle="Verify facility issue validity, adjust priority, or decline duplicate requests"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#1F293D] text-xs font-semibold text-slate-300 rounded-full hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={decision === 'reject' && !rejectionReason.trim()}
            className={`px-5 py-2 text-xs font-bold rounded-full shadow-sm transition-all ${
              decision === 'approve'
                ? 'bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] shadow-[0_0_16px_rgba(187,242,70,0.4)]'
                : 'bg-rose-600 hover:bg-rose-500 text-white disabled:bg-[#182132] disabled:text-slate-500'
            }`}
          >
            {decision === 'approve' ? 'Approve & Proceed' : 'Confirm Rejection'}
          </button>
        </>
      }
    >
      <div className="space-y-5 text-xs">
        {/* Ticket Summary Banner */}
        <div className="p-4 bg-[#0E131E] rounded-xl border border-[#1F293D] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-[#a3e635]">{ticket.id}</span>
            <div className="flex items-center gap-1.5">
              <PriorityBadge priority={ticket.priority} size="xs" />
              <StatusBadge status={ticket.status} size="xs" />
            </div>
          </div>
          <h4 className="text-sm font-bold text-white">{ticket.title}</h4>
          <p className="text-slate-300 leading-relaxed">{ticket.description}</p>
          <div className="pt-2 border-t border-[#1F293D] flex justify-between text-[11px] text-slate-400">
            <span>Requester: <strong className="text-white">{ticket.requester.name}</strong></span>
            <span>Location: <strong className="text-white">{ticket.room}</strong></span>
          </div>
        </div>

        {/* Decision Toggle */}
        <div>
          <label className="block font-semibold text-white mb-2">
            Verification Decision
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDecision('approve')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                decision === 'approve'
                  ? 'border-[#bbf246] bg-[#bbf246]/15 ring-2 ring-[#bbf246]/40 text-white font-bold'
                  : 'border-[#1F293D] bg-[#0E131E] hover:bg-white/5 text-slate-300'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 mt-0.5 ${decision === 'approve' ? 'text-[#a3e635]' : 'text-slate-400'}`} />
              <div>
                <span className="block font-bold">Approve Request</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Valid issue; queue for technician assignment.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDecision('reject')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                decision === 'reject'
                  ? 'border-rose-500 bg-rose-500/20 ring-2 ring-rose-500/40 text-white font-bold'
                  : 'border-[#1F293D] bg-[#0E131E] hover:bg-white/5 text-slate-300'
              }`}
            >
              <XCircle className={`w-4 h-4 mt-0.5 ${decision === 'reject' ? 'text-rose-400' : 'text-slate-400'}`} />
              <div>
                <span className="block font-bold">Reject Request</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Duplicate, unauthorized, or invalid complaint.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* If Approve: Priority Adjustment & Remarks */}
        {decision === 'approve' && (
          <div className="space-y-4 pt-2 border-t border-[#1F293D] animate-in fade-in">
            <div>
              <label className="block font-semibold text-white mb-1.5">
                Verify / Adjust Priority Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.keys(PRIORITIES).map((pKey) => (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => setAdjustedPriority(pKey)}
                    className={`p-2 rounded-lg border text-center transition-all text-xs ${
                      adjustedPriority === pKey
                        ? 'border-[#bbf246] bg-[#bbf246] text-[#020617] font-bold shadow-sm'
                        : 'border-[#1F293D] bg-[#0E131E] hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    {pKey}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Department Admins may elevate or de-escalate priority based on scheduled academic lab usage.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-white mb-1.5">
                Internal Verification Remarks (Optional)
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Verified with lab technician. Crucial for tomorrow's Practical Chemistry examination..."
                className="w-full p-2.5 bg-[#0E131E] text-white border border-[#1F293D] rounded-xl outline-none focus:border-[#a3e635] text-xs placeholder:text-slate-500"
              />
            </div>
          </div>
        )}

        {/* If Reject: Reason input */}
        {decision === 'reject' && (
          <div className="space-y-3 pt-2 border-t border-[#1F293D] animate-in fade-in">
            <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-start gap-2.5 text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] leading-relaxed">
                Rejection notifies the requester immediately. Please provide an explicit institutional reason below.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-white mb-1.5">
                Rejection Reason <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="State clearly why this request cannot proceed (e.g., duplicate of MRS-2026-0145, scheduled for complete room renovation next month)..."
                className="w-full p-2.5 bg-[#0E131E] text-white border border-rose-500/40 rounded-xl outline-none focus:border-rose-400 text-xs placeholder:text-slate-500"
              />
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
