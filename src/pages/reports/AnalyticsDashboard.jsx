import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  Layers,
  Building,
  Users
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { TrendChart } from '../../components/charts/TrendChart';
import { StatusDonut } from '../../components/charts/StatusDonut';
import { CategoryBarChart } from '../../components/charts/CategoryBarChart';
import { TECHNICIANS_DIRECTORY } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export const AnalyticsDashboard = () => {
  const { showToast } = useToast();
  const [timeRange, setTimeRange] = useState('This Semester');
  const [selectedFaculty, setSelectedFaculty] = useState('All');

  const recurringLocations = [
    { rank: 1, location: 'Seminar Room 204 (Building A)', category: 'Air Conditioning', count: 6, status: 'Recurrent Compressor Trip' },
    { rank: 2, location: 'Chemistry Laboratory (Building B)', category: 'Plumbing', count: 5, status: 'Sink Joint Leaks' },
    { rank: 3, location: 'Computer Lab 02 (Technology Complex)', category: 'IT Infrastructure', count: 4, status: 'Patch Cord Faults' },
    { rank: 4, location: 'Lecture Hall 01 (Building A)', category: 'Furniture', count: 4, status: 'Desk Armrest Fracture' },
    { rank: 5, location: 'Examination Division Room 12', category: 'Electrical', count: 3, status: 'Ballast Overheat' }
  ];

  const handleExport = (format) => {
    showToast(`Exporting executive maintenance analytics (${format.toUpperCase()})...`, 'info');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#131926] p-6 rounded-2xl border border-[#1F293D] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a3e635]">
              Executive Analytics • University Administration
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Campus Facility Intelligence & SLA Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic view of physical infrastructure reliability, response times, and trade squad productivity across University of Vavuniya.
          </p>
        </div>

        {/* Global Filters & Export Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3.5 py-2 text-xs border border-[#1F293D] rounded-full bg-[#0E131E] text-white outline-none font-medium focus:border-[#a3e635]"
          >
            <option className="bg-[#0E131E] text-white">This Week</option>
            <option className="bg-[#0E131E] text-white">This Month</option>
            <option className="bg-[#0E131E] text-white">This Semester</option>
            <option className="bg-[#0E131E] text-white">Academic Year 2025/2026</option>
          </select>

          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="px-3.5 py-2 text-xs border border-[#1F293D] rounded-full bg-[#0E131E] text-white outline-none font-medium focus:border-[#a3e635]"
          >
            <option value="All" className="bg-[#0E131E] text-white">All Faculties & Units</option>
            <option className="bg-[#0E131E] text-white">Faculty of Applied Science</option>
            <option className="bg-[#0E131E] text-white">Faculty of Technological Studies</option>
            <option className="bg-[#0E131E] text-white">Faculty of Business Studies</option>
            <option className="bg-[#0E131E] text-white">Central Administration</option>
          </select>

          <button
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full border border-[#1F293D] bg-[#0E131E] hover:bg-white/5 text-slate-200 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Brief</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] shadow-[0_0_16px_rgba(187,242,70,0.4)] transition-all"
          >
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top Level Strategic Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Work Orders"
          value="148"
          trend="18% vs last term"
          trendPositive={true}
          icon={Layers}
        />
        <StatCard
          title="Avg Resolution"
          value="16.2 hrs"
          trend="4.1 hrs faster"
          trendPositive={true}
          icon={Clock}
          iconBg="bg-blue-50 text-brand-blue border-blue-100"
        />
        <StatCard
          title="Resolution Rate"
          value="91.8%"
          trend="2.4% improved"
          trendPositive={true}
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600 border-emerald-100"
        />
        <StatCard
          title="Open Issues"
          value="18"
          subtitle="Across campus"
          icon={AlertTriangle}
          iconBg="bg-amber-50 text-amber-600 border-amber-100"
        />
        <StatCard
          title="Recurring Hotspots"
          value="5"
          subtitle="Repeated faults"
          icon={Building}
          iconBg="bg-rose-50 text-rose-600 border-rose-100"
        />
        <StatCard
          title="Active Technicians"
          value="5"
          subtitle="Squad capacity"
          icon={Users}
          iconBg="bg-purple-50 text-purple-600 border-purple-100"
        />
      </div>

      {/* Charts Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">
              Maintenance Requests & Resolutions Over Time
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Longitudinal volume comparison across months
          </p>
          <TrendChart height={250} />
        </div>

        <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">
              Work Order Status Proportion
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Real-time pipeline distribution of campus tickets
          </p>
          <StatusDonut />
        </div>
      </div>

      {/* Secondary Row: Category Volume & Recurring Fault Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card">
          <h3 className="text-sm font-bold text-white mb-1">
            Issues by Maintenance Category
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Volume of reported faults segregated by specialized trade squad
          </p>
          <CategoryBarChart />
        </div>

        {/* Recurring Fault Hotspots */}
        <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card overflow-hidden">
          <h3 className="text-sm font-bold text-white mb-1">
            Top Recurring Fault Hotspots
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Facilities requiring structural preventive maintenance or component overhaul
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0E131E] border-b border-[#1F293D] text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Campus Location</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Incidents</th>
                  <th className="py-2.5 px-3">Root Cause Diagnosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293D]/70">
                {recurringLocations.map((item) => (
                  <tr key={item.rank} className="hover:bg-[#182132]/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold font-mono text-[#a3e635]">
                      0{item.rank}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white max-w-[170px] truncate">
                      {item.location}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-400">
                      {item.count} tickets
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[140px]">
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Technician Performance & Workload Scorecard */}
      <div className="bg-[#131926] rounded-2xl border border-[#1F293D] shadow-card p-6 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-1">
          Technician Fleet Workload & Performance Scorecard
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Individual technician job velocity, satisfaction rating, and active dispatch capacity
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0E131E] border-b border-[#1F293D] text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Technician</th>
                <th className="py-3 px-4">Trade Specialization</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Active Jobs</th>
                <th className="py-3 px-4">Workload Capacity</th>
                <th className="py-3 px-4">User Rating</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F293D]/70">
              {TECHNICIANS_DIRECTORY.map((tech) => {
                const percent = Math.min(100, (tech.activeJobs / 5) * 100);
                return (
                  <tr key={tech.id} className="hover:bg-[#182132]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {tech.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#a3e635] font-medium whitespace-nowrap">
                      {tech.trade}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {tech.experience}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {tech.activeJobs} jobs
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="w-28 h-2 bg-[#1F293D] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            percent > 70 ? 'bg-rose-500' : percent > 40 ? 'bg-amber-400' : 'bg-[#a3e635]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                      ★ {tech.rating} / 5.0
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          tech.status === 'Available'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : tech.status === 'Busy'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {tech.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
