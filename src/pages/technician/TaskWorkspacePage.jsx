import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Wrench,
  Package,
  UploadCloud,
  FileText,
  AlertTriangle,
  Phone,
  Send,
  Plus,
  X
} from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const TaskWorkspacePage = ({ ticketId, onBack }) => {
  const { tickets, updateDiagnosis, toggleChecklistItem, requestParts, submitWorkReport, updateTicketStatus } = useTickets();
  const { inventory } = useInventory();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const ticket = tickets.find((t) => t.id === ticketId) || tickets[0];

  // Workspace form state
  const [diagnosis, setDiagnosis] = useState(ticket?.diagnosisNotes || '');
  const [reportSummary, setReportSummary] = useState('');
  const [showPartModal, setShowPartModal] = useState(false);
  const [selectedItemCode, setSelectedItemCode] = useState(inventory[0]?.code || '');
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const [partUrgency, setPartUrgency] = useState('High');

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p>No active maintenance task selected.</p>
        <button onClick={onBack} className="mt-2 text-xs text-brand-blue underline">
          Return to Queue
        </button>
      </div>
    );
  }

  const handleSaveDiagnosis = () => {
    if (!diagnosis.trim()) return;
    updateDiagnosis(ticket.id, diagnosis, currentUser.name);
  };

  const handleRequestPartSubmit = (e) => {
    e.preventDefault();
    const item = inventory.find((i) => i.code === selectedItemCode);
    if (!item) return;

    requestParts(ticket.id, {
      itemId: item.id,
      name: item.name,
      quantity: requestedQuantity,
      status: "Pending",
      date: new Date().toISOString().slice(0, 10)
    });

    setShowPartModal(false);
    setRequestedQuantity(1);
  };

  const handleFinishRepair = () => {
    submitWorkReport(ticket.id, reportSummary, currentUser.name);
  };

  const handleStartInspection = () => {
    updateTicketStatus(ticket.id, 'Inspection', 'Technician arrived on site to evaluate fault', currentUser.name);
  };

  const handleStartRepair = () => {
    updateTicketStatus(ticket.id, 'In Progress', 'Active repair procedures initiated', currentUser.name);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-card border border-brand-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-text hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-blue">{ticket.id}</span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h1 className="text-lg font-bold text-brand-text mt-0.5">{ticket.title}</h1>
          </div>
        </div>

        {/* Action button based on current status */}
        <div className="flex items-center gap-2">
          {ticket.status === 'Assigned' && (
            <button
              onClick={handleStartInspection}
              className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Start Site Inspection
            </button>
          )}
          {ticket.status === 'Inspection' && (
            <button
              onClick={handleStartRepair}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Start Repair Work
            </button>
          )}
          {(ticket.status === 'In Progress' || ticket.status === 'Awaiting Parts') && (
            <button
              onClick={handleFinishRepair}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Mark Repair Complete
            </button>
          )}
        </div>
      </div>

      {/* Campus Location Card & Requester Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-card border border-brand-border p-4 shadow-xs text-xs space-y-1.5">
          <span className="font-semibold uppercase tracking-wider text-brand-text-secondary text-[10px]">
            Target Location
          </span>
          <div className="text-sm font-bold text-brand-text">{ticket.room}</div>
          <div className="text-slate-600">{ticket.building} • {ticket.floor}</div>
          <div className="text-slate-500">{ticket.faculty}</div>
        </div>

        <div className="bg-white rounded-card border border-brand-border p-4 shadow-xs text-xs space-y-1.5">
          <span className="font-semibold uppercase tracking-wider text-brand-text-secondary text-[10px]">
            Faculty Requester
          </span>
          <div className="text-sm font-bold text-brand-text">{ticket.requester.name}</div>
          <div className="text-slate-600">{ticket.requester.role}</div>
          <div className="font-mono text-slate-500 flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{ticket.requester.phone || 'ext. 204'}</span>
          </div>
        </div>
      </div>

      {/* Section 1: Mobile Diagnostic Checklist */}
      <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-brand-text">Field Inspection Checklist</h3>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              Follow safe standard operating procedures for {ticket.category}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {ticket.checklist?.filter((c) => c.done).length || 0} / {ticket.checklist?.length || 0} completed
          </span>
        </div>

        <div className="space-y-2">
          {ticket.checklist?.map((item, idx) => (
            <div
              key={idx}
              onClick={() => toggleChecklistItem(ticket.id, idx)}
              className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                item.done
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => {}} // handled by div
                className="rounded text-brand-blue focus:ring-brand-blue w-4 h-4"
              />
              <span className={`text-xs flex-1 ${item.done ? 'line-through text-slate-500' : 'font-medium'}`}>
                {item.task}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Diagnosis Notes */}
      <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-brand-text">Diagnostic Findings & Technical Notes</h3>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Document root cause of failure (e.g. capacitor voltage breakdown, broken valve, etc.)
          </p>
        </div>

        <textarea
          rows={3}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Enter detailed technical measurements, pressure readings, motor insulation ohms, or hardware diagnostics..."
          className="w-full p-3 text-xs text-brand-text border border-brand-border rounded-lg outline-none focus:border-brand-blue"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSaveDiagnosis}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            Save Diagnosis Note
          </button>
        </div>
      </div>

      {/* Section 3: Spare Parts Requisition */}
      <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-brand-text flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-blue" />
              <span>Required Spare Parts & Consumables</span>
            </h3>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              Direct integration with Central Maintenance Stores
            </p>
          </div>

          <button
            onClick={() => setShowPartModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-brand-blue hover:bg-blue-100 rounded-lg text-xs font-semibold border border-blue-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Requisition Part from Stores</span>
          </button>
        </div>

        {ticket.itemRequests && ticket.itemRequests.length > 0 ? (
          <div className="space-y-2">
            {ticket.itemRequests.map((req, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-brand-text">{req.name}</span>
                  <span className="text-slate-400 block text-[11px]">Requested: {req.quantity} ({req.date})</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    req.status === 'Issued'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed">
            No spare parts requested for this work order yet.
          </div>
        )}
      </div>

      {/* Section 4: Final Work Completion Report */}
      <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-brand-text">Completion Work Report</h3>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Summarize the repair procedures executed before handing back to faculty.
          </p>
        </div>

        <textarea
          rows={3}
          value={reportSummary}
          onChange={(e) => setReportSummary(e.target.value)}
          placeholder="e.g. Replaced 45uF motor capacitor, charged 1.2kg R410A refrigerant. Tested cooling for 45 minutes; air output steady at 16°C. Work area cleaned."
          className="w-full p-3 text-xs text-brand-text border border-brand-border rounded-lg outline-none focus:border-brand-blue"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Sign-off technician: <strong>{currentUser.name}</strong>
          </span>
          <button
            onClick={handleFinishRepair}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            Submit Work Report & Mark Resolved
          </button>
        </div>
      </div>

      {/* Part Requisition Modal */}
      {showPartModal && (
        <Modal
          isOpen={showPartModal}
          onClose={() => setShowPartModal(false)}
          title="Requisition Item from Central Stores"
          subtitle={`Ticket Reference: ${ticket.id}`}
          footer={
            <>
              <button
                onClick={() => setShowPartModal(false)}
                className="px-4 py-2 border border-slate-300 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestPartSubmit}
                className="px-5 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Send Request to Stores
              </button>
            </>
          }
        >
          <form onSubmit={handleRequestPartSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-brand-text mb-1.5">
                Select Inventory Item
              </label>
              <select
                value={selectedItemCode}
                onChange={(e) => setSelectedItemCode(e.target.value)}
                className="w-full p-2.5 border border-brand-border rounded-lg outline-none"
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.code}>
                    {item.name} ({item.code}) - {item.stock} in stock
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-brand-text mb-1.5">
                  Quantity Required
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 border border-brand-border rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1.5">
                  Requisition Urgency
                </label>
                <select
                  value={partUrgency}
                  onChange={(e) => setPartUrgency(e.target.value)}
                  className="w-full p-2.5 border border-brand-border rounded-lg outline-none"
                >
                  <option>Urgent</option>
                  <option>High</option>
                  <option>Normal</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
