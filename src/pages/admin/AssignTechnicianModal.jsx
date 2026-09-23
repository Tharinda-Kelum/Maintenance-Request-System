import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Wrench, Phone, CheckCircle2, Star, AlertCircle } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';

export const AssignTechnicianModal = ({ isOpen, onClose, ticket }) => {
  const { technicians, assignTechnician } = useTickets();
  const { currentUser } = useAuth();
  const [selectedTechId, setSelectedTechId] = useState(ticket?.assignedTo?.id || 'tech-01');

  if (!ticket) return null;

  const handleAssign = () => {
    if (!selectedTechId) return;
    assignTechnician(ticket.id, selectedTechId, currentUser);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Maintenance Technician"
      subtitle={`Ticket: ${ticket.id} (${ticket.category} • ${ticket.priority} Priority)`}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#1F293D] text-xs font-semibold text-slate-300 rounded-full hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="px-5 py-2 bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] text-xs font-bold rounded-full shadow-[0_0_16px_rgba(187,242,70,0.4)] transition-all"
          >
            Confirm Assignment
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <p className="text-slate-400">
          Select a specialized technician from the Works & Maintenance Division. Workload status is updated in real time.
        </p>

        {/* Technician Cards */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {technicians.map((tech) => {
            const isSelected = selectedTechId === tech.id;
            const workloadPercent = Math.min(100, Math.round((tech.activeJobs / 5) * 100));

            return (
              <div
                key={tech.id}
                onClick={() => setSelectedTechId(tech.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#bbf246] bg-[#bbf246]/15 ring-2 ring-[#bbf246]/40 shadow-[0_0_16px_rgba(187,242,70,0.2)]'
                    : 'border-[#1F293D] bg-[#0E131E] hover:border-slate-600 hover:bg-[#182132]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#182132] text-[#a3e635] border border-[#1F293D] font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {tech.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{tech.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            tech.status === 'Available'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : tech.status === 'Busy'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {tech.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#a3e635] font-medium mt-0.5">{tech.trade}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Experience: {tech.experience} • Rating: ★ {tech.rating}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white font-mono">
                      {tech.activeJobs} active jobs
                    </span>
                    {/* Workload Mini Bar */}
                    <div className="w-24 h-1.5 bg-[#1F293D] rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          workloadPercent > 70
                            ? 'bg-rose-500'
                            : workloadPercent > 40
                            ? 'bg-amber-400'
                            : 'bg-[#a3e635]'
                        }`}
                        style={{ width: `${workloadPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Specialties chips */}
                {tech.specialties && (
                  <div className="mt-2.5 pt-2 border-t border-[#1F293D] flex flex-wrap gap-1">
                    {tech.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#182132] text-slate-300 border border-[#1F293D]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
