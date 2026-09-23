import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, FileText, Download } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { TrendChart } from '../../components/charts/TrendChart';
import { StatusDonut } from '../../components/charts/StatusDonut';
import { CategoryBarChart } from '../../components/charts/CategoryBarChart';
import { useAuth } from '../../context/AuthContext';

export const DeptReportsPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-card border border-brand-border shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text">
            Department Performance & SLA Report
          </h1>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Maintenance velocity, average turnaround time, and category distribution for {currentUser.department}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select className="px-3 py-2 text-xs border border-brand-border rounded-lg bg-white outline-none">
            <option>Semester II (Current)</option>
            <option>Semester I (2026)</option>
            <option>Full Year 2025</option>
          </select>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700">
            <Download className="w-3.5 h-3.5" />
            <span>Download Summary</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Logged Issues"
          value="94"
          trend="12% from last term"
          trendPositive={true}
          icon={FileText}
        />
        <StatCard
          title="Avg Resolution Time"
          value="14.8 hrs"
          trend="2.4 hrs faster"
          trendPositive={true}
          icon={Clock}
          iconBg="bg-blue-50 text-brand-blue"
        />
        <StatCard
          title="SLA Compliance Rate"
          value="92.4%"
          trend="3.1% improved"
          trendPositive={true}
          icon={TrendingUp}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="First-Time Fix Rate"
          value="88.2%"
          subtitle="Without re-work"
          icon={CheckCircle2}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs">
          <h3 className="text-sm font-bold text-brand-text mb-1">
            Department Maintenance Volume (Semester Trend)
          </h3>
          <p className="text-xs text-brand-text-secondary mb-4">
            Comparison between newly reported faults vs completed repairs
          </p>
          <TrendChart height={240} />
        </div>

        <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs">
          <h3 className="text-sm font-bold text-brand-text mb-1">
            Work Order Status Distribution
          </h3>
          <p className="text-xs text-brand-text-secondary mb-4">
            Current state of physical infrastructure tickets
          </p>
          <StatusDonut />
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-card border border-brand-border p-6 shadow-xs">
        <h3 className="text-sm font-bold text-brand-text mb-1">
          Fault Category Volume Breakdown
        </h3>
        <p className="text-xs text-brand-text-secondary mb-4">
          Breakdown of maintenance activities across trade squads
        </p>
        <CategoryBarChart />
      </div>
    </div>
  );
};
