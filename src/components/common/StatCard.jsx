import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-[#0E131E] text-[#a3e635] border-[#1F293D]',
  trend,
  trendPositive = true,
  onClick,
  active = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#131926] rounded-2xl border p-5 transition-all duration-150 ${
        active
          ? 'border-[#a3e635] ring-1 ring-[#a3e635]/40 shadow-[0_0_15px_rgba(187,242,70,0.2)]'
          : 'border-[#1F293D] hover:border-slate-600 shadow-card'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border flex-shrink-0 ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          {trend && (
            <span
              className={`inline-flex items-center font-bold ${
                trendPositive ? 'text-[#a3e635]' : 'text-rose-400'
              }`}
            >
              {trendPositive ? '↑' : '↓'} {trend}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
