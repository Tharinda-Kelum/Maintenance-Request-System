import React from 'react';

export const StatusBadge = ({ status, size = 'sm' }) => {
  const statusStyles = {
    Submitted: 'bg-[#182132] text-sky-400 border-sky-500/30 dot-bg-sky-400',
    'Pending Review': 'bg-[#182132] text-amber-300 border-amber-500/30 dot-bg-amber-400',
    Approved: 'bg-[#182132] text-indigo-300 border-indigo-500/30 dot-bg-indigo-400',
    Assigned: 'bg-[#182132] text-blue-400 border-blue-500/30 dot-bg-blue-400',
    Inspection: 'bg-[#182132] text-cyan-300 border-cyan-500/30 dot-bg-cyan-400',
    'In Progress': 'bg-[#1a2e1a] text-lime-bright border-lime-bright/40 dot-bg-lime-bright',
    'Awaiting Parts': 'bg-[#182132] text-orange-400 border-orange-500/30 dot-bg-orange-400',
    'Repair Completed': 'bg-[#13281a] text-emerald-300 border-emerald-500/40 dot-bg-emerald-400',
    Resolved: 'bg-[#182132] text-emerald-400 border-emerald-500/40 dot-bg-emerald-400',
    Completed: 'bg-[#182132] text-emerald-300 border-emerald-500/40 dot-bg-emerald-400',
    Rejected: 'bg-[#291418] text-rose-400 border-rose-500/30 dot-bg-rose-400'
  };

  const style = statusStyles[status] || 'bg-[#182132] text-slate-300 border-slate-700';

  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.5 text-[10px]' 
    : size === 'md' 
    ? 'px-3.5 py-1 text-xs' 
    : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs ${style} ${sizeClasses} transition-all`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{status}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority, size = 'sm' }) => {
  const priorityStyles = {
    Urgent: 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse',
    High: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    Medium: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    Low: 'bg-slate-800 text-slate-400 border-slate-700'
  };

  const style = priorityStyles[priority] || priorityStyles.Medium;

  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.5 text-[10px]' 
    : size === 'md' 
    ? 'px-3.5 py-1 text-xs' 
    : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${style} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{priority}</span>
    </span>
  );
};

export const RoleBadge = ({ role, label }) => {
  const roleStyles = {
    general_user: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dept_admin: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    technician: 'bg-lime-subtle text-lime-bright border-lime-bright/30 font-bold',
    store_keeper: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    super_admin: 'bg-slate-800 text-white border-slate-700'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
        roleStyles[role] || 'bg-slate-800 text-slate-300 border-slate-700'
      }`}
    >
      {label || role}
    </span>
  );
};
