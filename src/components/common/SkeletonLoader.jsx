import React from 'react';

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-brand-border overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100/70 border-b border-brand-border" />
      <div className="divide-y divide-brand-border/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center justify-between gap-4">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-4 bg-slate-200 rounded w-48 hidden sm:block" />
            <div className="h-4 bg-slate-100 rounded w-28 hidden md:block" />
            <div className="h-6 bg-slate-200 rounded-full w-20" />
            <div className="h-6 bg-slate-100 rounded-full w-16" />
            <div className="h-8 bg-slate-200 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-card border border-brand-border p-5 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-20" />
          <div className="h-8 bg-slate-200 rounded w-16" />
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-lg" />
      </div>
      <div className="mt-4 h-3 bg-slate-100 rounded w-32" />
    </div>
  );
};
