import React from 'react';

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
