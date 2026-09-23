import React from 'react';

export const StatusDonut = ({ data }) => {
  const defaultSegments = [
    { label: 'Resolved / Completed', value: 84, color: '#10B981' },
    { label: 'In Progress', value: 32, color: '#7C3AED' },
    { label: 'Awaiting Parts', value: 14, color: '#EA580C' },
    { label: 'Pending Review', value: 18, color: '#F59E0B' },
    { label: 'Assigned', value: 24, color: '#2563EB' }
  ];

  const segments = data || defaultSegments;
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let cumulativeAngle = 0;
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* SVG Donut */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {segments.map((seg, i) => {
            const strokeDasharray = `${(seg.value / total) * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeAngle;
            cumulativeAngle += (seg.value / total) * circumference;

            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 hover:opacity-85"
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-brand-text">{total}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Work Orders
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full space-y-2.5">
        {segments.map((seg, i) => {
          const percent = Math.round((seg.value / total) * 100);
          return (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                <span className="text-slate-600 font-medium">{seg.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-semibold text-brand-text">{seg.value}</span>
                <span className="text-slate-400 text-[11px]">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CategoryBarChart = ({ data }) => {
  const defaultCategories = [
    { name: 'Electrical Works', count: 48, percentage: 85, color: 'bg-amber-500' },
    { name: 'Air Conditioning', count: 36, percentage: 65, color: 'bg-cyan-500' },
    { name: 'IT Infrastructure', count: 32, percentage: 58, color: 'bg-indigo-500' },
    { name: 'Plumbing & Water', count: 26, percentage: 46, color: 'bg-blue-500' },
    { name: 'Civil & Carpentry', count: 19, percentage: 34, color: 'bg-orange-500' },
    { name: 'Fire & Safety', count: 8, percentage: 14, color: 'bg-red-500' }
  ];

  const categories = data || defaultCategories;

  return (
    <div className="space-y-3.5">
      {categories.map((cat, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-700">{cat.name}</span>
            <span className="font-mono text-slate-500">{cat.count} requests</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${cat.color} transition-all duration-500`}
              style={{ width: `${cat.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
