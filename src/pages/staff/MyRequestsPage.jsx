import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  ChevronRight,
  X
} from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { CATEGORIES } from '../../data/mockData';

export const MyRequestsPage = ({ onNavigate, onSelectTicket }) => {
  const { tickets } = useTickets();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Segmented status tabs
  const tabs = [
    { label: 'All', count: tickets.length },
    { label: 'Open', count: tickets.filter((t) => t.status === 'Submitted' || t.status === 'Pending Review' || t.status === 'Approved').length },
    { label: 'In Progress', count: tickets.filter((t) => t.status === 'In Progress' || t.status === 'Assigned' || t.status === 'Inspection').length },
    { label: 'Awaiting Parts', count: tickets.filter((t) => t.status === 'Awaiting Parts').length },
    { label: 'Resolved', count: tickets.filter((t) => t.status === 'Resolved' || t.status === 'Completed').length },
    { label: 'Rejected', count: tickets.filter((t) => t.status === 'Rejected').length }
  ];

  // Filtering
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (activeTab === 'Open' && !['Submitted', 'Pending Review', 'Approved'].includes(t.status)) return false;
      if (activeTab === 'In Progress' && !['In Progress', 'Assigned', 'Inspection'].includes(t.status)) return false;
      if (activeTab === 'Awaiting Parts' && t.status !== 'Awaiting Parts') return false;
      if (activeTab === 'Resolved' && !['Resolved', 'Completed', 'Repair Completed'].includes(t.status)) return false;
      if (activeTab === 'Rejected' && t.status !== 'Rejected') return false;

      if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
      if (selectedPriority !== 'All' && t.priority !== selectedPriority) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.room.toLowerCase().includes(q) ||
          t.building.toLowerCase().includes(q) ||
          t.requester.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tickets, activeTab, selectedCategory, selectedPriority, searchQuery]);

  const totalPages = Math.ceil(filteredTickets.length / pageSize) || 1;
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportCSV = () => {
    showToast('Exporting maintenance records to CSV format...', 'info');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedPriority !== 'All' || searchQuery.trim() !== '';

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Maintenance Requests
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Central ledger of campus infrastructure faults across university facilities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 bg-[#131926] hover:bg-[#1A2234] border border-[#1F293D] rounded-full shadow-card transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onNavigate('create_request')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#020617] bg-[#bbf246] hover:bg-[#a3e635] rounded-full shadow-[0_0_20px_rgba(187,242,70,0.5)] transition-all transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Segmented Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isTabActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => {
                setActiveTab(tab.label);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
                isTabActive
                  ? 'bg-[#bbf246] text-[#020617] shadow-[0_0_16px_rgba(187,242,70,0.5)]'
                  : 'bg-[#131926] text-slate-300 border border-[#1F293D] hover:text-white hover:bg-[#182132]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isTabActive
                    ? 'bg-[#020617] text-white'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-3 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by ID, title, room, staff..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-white bg-[#0E131E] border border-[#1F293D] rounded-full outline-none focus:border-lime-bright"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs text-slate-300 bg-[#0E131E] border border-[#1F293D] rounded-full outline-none focus:border-lime-bright"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => {
              setSelectedPriority(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs text-slate-300 bg-[#0E131E] border border-[#1F293D] rounded-full outline-none focus:border-lime-bright"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-rose-400 hover:underline px-2 py-1 flex items-center gap-1 whitespace-nowrap"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Requests Data Table */}
      <div className="bg-[#131926] rounded-2xl border border-[#1F293D] shadow-card overflow-hidden">
        {paginatedTickets.length === 0 ? (
          <EmptyState
            title="No maintenance requests match criteria"
            description="Try changing the category or status filter, or clear your search query."
            actionText="Clear All Filters"
            onAction={clearFilters}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0E131E] border-b border-[#1F293D] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Ticket ID</th>
                    <th className="py-3.5 px-4">Issue Summary</th>
                    <th className="py-3.5 px-4">Requester</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Assigned To</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F293D]/70">
                  {paginatedTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => onSelectTicket(ticket.id)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-lime-bright whitespace-nowrap">
                        {ticket.id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white max-w-xs">
                        <span className="truncate block font-semibold">{ticket.title}</span>
                        <span className="text-[11px] text-slate-400">Created: {ticket.submittedAt}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        <div className="font-medium text-white">{ticket.requester.name}</div>
                        <div className="text-[10px] text-slate-400">{ticket.requester.role}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="font-medium text-white truncate max-w-[150px]">{ticket.room}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{ticket.building}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {ticket.category}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PriorityBadge priority={ticket.priority} size="xs" />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {ticket.assignedTo ? (
                          <div>
                            <span className="font-medium text-white">{ticket.assignedTo.name}</span>
                            <span className="text-[10px] text-slate-400 block">{ticket.assignedTo.trade}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={ticket.status} size="xs" />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="p-1.5 rounded-full text-slate-400 group-hover:text-lime-bright group-hover:bg-white/5 inline-flex items-center transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-[#1F293D] bg-[#0E131E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div>
                Showing{' '}
                <span className="font-semibold text-white">
                  {(currentPage - 1) * pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-white">
                  {Math.min(currentPage * pageSize, filteredTickets.length)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-white">
                  {filteredTickets.length}
                </span>{' '}
                tickets
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-full border border-[#1F293D] bg-[#131926] hover:bg-[#1A2234] text-slate-200 disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <div className="px-2 font-mono font-medium text-lime-bright">
                  {currentPage} of {totalPages}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-full border border-[#1F293D] bg-[#131926] hover:bg-[#1A2234] text-slate-200 disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
