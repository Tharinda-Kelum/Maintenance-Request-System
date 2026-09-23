import React from 'react';

export const TrendChart = ({ data, height = 220 }) => {
  // Default dataset if none provided
  const chartData = data || [
    { label: 'May', requests: 42, resolved: 38 },
    { label: 'Jun', requests: 56, resolved: 50 },
    { label: 'Jul', requests: 64, resolved: 58 },
    { label: 'Aug', requests: 78, resolved: 71 },
    { label: 'Sep (Current)', requests: 92, resolved: 84 }
  ];

  const maxVal = Math.max(...chartData.map((d) => Math.max(d.requests, d.resolved))) * 1.15;
  const chartWidth = 560;
  const chartHeight = height;
  const paddingX = 40;
  const paddingY = 25;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  const getX = (index) => paddingX + (index / (chartData.length - 1)) * usableWidth;
  const getY = (val) => chartHeight - paddingY - (val / maxVal) * usableHeight;

  const requestsPoints = chartData.map((d, i) => `${getX(i)},${getY(d.requests)}`).join(' ');
  const resolvedPoints = chartData.map((d, i) => `${getX(i)},${getY(d.resolved)}`).join(' ');

  const requestsArea = `${getX(0)},${chartHeight - paddingY} ${requestsPoints} ${getX(chartData.length - 1)},${chartHeight - paddingY}`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-brand-blue" />
            <span className="text-slate-600 font-medium">New Requests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-slate-600 font-medium">Resolved</span>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono">Monthly Rate (Semester II)</span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#155EEF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#155EEF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - paddingY - ratio * usableHeight;
            const val = Math.round(ratio * maxVal);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#E4E7EC"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text x={paddingX - 10} y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <polygon points={requestsArea} fill="url(#blueGradient)" />

          {/* Lines */}
          <polyline
            fill="none"
            stroke="#155EEF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={requestsPoints}
          />
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={resolvedPoints}
          />

          {/* Data Points */}
          {chartData.map((d, i) => (
            <g key={i}>
              <circle
                cx={getX(i)}
                cy={getY(d.requests)}
                r="4.5"
                className="fill-white stroke-brand-blue stroke-[2.5]"
              />
              <circle
                cx={getX(i)}
                cy={getY(d.resolved)}
                r="4"
                className="fill-white stroke-emerald-500 stroke-[2.5]"
              />
              {/* X Labels */}
              <text
                x={getX(i)}
                y={chartHeight - 6}
                textAnchor="middle"
                className="text-[11px] fill-slate-500 font-medium"
              >
                {d.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
