import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  MapPin,
  FileText,
  User,
  Package
} from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

export const TechnicianDashboard = ({ onOpenWorkspace, onSelectTicket }) => {
  const { tickets } = useTickets();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('All');

  const myTasks = tickets.filter(
    (t) =>
      (t.assignedTo && (t.assignedTo.name === currentUser.name || t.assignedTo.trade?.includes('Electrical') || t.assignedTo.trade?.includes('HVAC'))) ||
      t.status === 'Assigned' ||
      t.status === 'In Progress' ||
      t.status === 'Inspection' ||
      t.status === 'Awaiting Parts'
  );

  const assignedCount = myTasks.filter((t) => t.status === 'Assigned').length;
  const inProgressCount = myTasks.filter((t) => t.status === 'In Progress' || t.status === 'Inspection').length;
  const awaitingPartsCount = myTasks.filter((t) => t.status === 'Awaiting Parts').length;
  const highPriorityCount = myTasks.filter((t) => (t.priority === 'High' || t.priority === 'Urgent') && t.status !== 'Resolved').length;
  const completedTodayCount = myTasks.filter((t) => t.status === 'Resolved' || t.status === 'Repair Completed').length;

  const tabs = [
    { label: 'All', count: myTasks.length },
    { label: 'Newly Assigned', count: assignedCount },
    { label: 'In Progress', count: inProgressCount },
    { label: 'Awaiting Parts', count: awaitingPartsCount },
    { label: 'Completed', count: completedTodayCount }
  ];

  const filteredTasks = useMemo(() => {
    return myTasks.filter((t) => {
      if (activeTab === 'Newly Assigned') return t.status === 'Assigned';
      if (activeTab === 'In Progress') return t.status === 'In Progress' || t.status === 'Inspection';
      if (activeTab === 'Awaiting Parts') return t.status === 'Awaiting Parts';
      if (activeTab === 'Completed') return t.status === 'Resolved' || t.status === 'Repair Completed' || t.status === 'Completed';
      return true;
    });
  }, [myTasks, activeTab]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#a3e635]">
              Field Technician Cockpit • {currentUser.trade || 'Electrical & HVAC Specialist'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            My Maintenance Tasks
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active on-site repair jobs, fault diagnoses, and Central Stores spare parts requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-mono bg-[#131926] px-3 py-1.5 rounded-full border border-[#1F293D]">
            Active Workload: <strong className="text-[#a3e635] font-bold">{inProgressCount + assignedCount} jobs</strong>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Assigned"
          value={assignedCount}
          subtitle="New work orders"
          icon={Wrench}
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Active on campus"
          icon={Clock}
          active={inProgressCount > 0}
        />
        <StatCard
          title="Awaiting Parts"
          value={awaitingPartsCount}
          subtitle="Stores requisition"
          icon={Package}
        />
        <StatCard
          title="Urgent / High"
          value={highPriorityCount}
          subtitle="Priority attention"
          icon={AlertTriangle}
        />
        <StatCard
          title="Completed"
          value={completedTodayCount}
          subtitle="Turnaround achieved"
          icon={CheckCircle2}
        />
      </div>

      {/* Task Queue Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isTabActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
                isTabActive
                  ? 'bg-[#bbf246] text-[#020617] shadow-[0_0_16px_rgba(187,242,70,0.5)]'
                  : 'bg-[#131926] text-slate-300 border border-[#1F293D] hover:text-white hover:bg-[#182132]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
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

      {/* Task Queue Cards */}
      <div className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="You're all caught up!"
            description="No maintenance tasks are currently in this filter category."
            actionText="View All Assigned Tasks"
            onAction={() => setActiveTab('All')}
          />
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#131926] rounded-2xl border border-[#1F293D] p-5 hover:border-slate-600 shadow-card transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0E131E] border border-[#1F293D] text-[#a3e635] flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    {task.category.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#a3e635]">
                        {task.id}
                      </span>
                      <PriorityBadge priority={task.priority} size="xs" />
                      <StatusBadge status={task.status} size="xs" />
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">
                      {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {task.room}, {task.building}
                      </span>
                      <span>Faculty: {task.faculty}</span>
                      <span className="font-mono text-[11px] text-[#a3e635] font-bold">SLA: {task.slaDue}</span>
                    </div>
                  </div>
                </div>

                {/* Right CTAs */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => onSelectTicket(task.id)}
                    className="px-4 py-2 text-xs font-semibold rounded-full border border-[#1F293D] bg-[#0E131E] hover:bg-white/5 text-slate-300 transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onOpenWorkspace(task.id)}
                    className="px-4 py-2 text-xs font-extrabold rounded-full bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] shadow-[0_0_16px_rgba(187,242,70,0.4)] transition-all inline-flex items-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Open Field Workspace</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
