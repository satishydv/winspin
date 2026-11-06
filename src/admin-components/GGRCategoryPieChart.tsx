import React, { useState } from 'react';
import { PieChart, Info, HelpCircle } from 'lucide-react';

interface PieSegment {
  name: string;
  percent: number;
  value: string;
  color: string;
  colorCode: string;
}

export default function GGRCategoryPieChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const splits: PieSegment[] = [
    { name: 'Slots Reels', percent: 45, value: '₹9,000', color: 'bg-amber-500', colorCode: '#F59E0B' },
    { name: 'Sportsbook', percent: 21.5, value: '₹4,300', color: 'bg-blue-500', colorCode: '#3B82F6' },
    { name: 'Roulette Live', percent: 20, value: '₹4,000', color: 'bg-rose-500', colorCode: '#EF4444' },
    { name: 'Crash Turbo', percent: 10, value: '₹2,000', color: 'bg-purple-500', colorCode: '#A855F7' },
    { name: 'VIP Blackjack', percent: 3.5, value: '₹700', color: 'bg-indigo-500', colorCode: '#6366F1' }
  ];

  const totalGGR = 20000; // sum of splits values is 20,000

  // SVG parameters
  const r = 40;
  const circumference = 2 * Math.PI * r; // ~251.33

  // Cumulative offset calculator
  let accumulatedPercent = 0;

  return (
    <div id="ggr-category-pie-chart-card" className="bg-obsidian-900 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden select-none min-h-[300px] h-[340px]">
      
      {/* Glow highlight */}
      <div className="absolute top-[-40px] right-[-40px] w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
            <PieChart className="w-4 h-4 text-amber-500" />
            Category Revenue Split
          </h3>
          <p className="text-slate-400 text-[11px] font-sans mt-0.5">
            Breakdown of GGR contributions by game category
          </p>
        </div>
        <HelpCircle className="w-4 h-4 text-slate-600 hover:text-slate-400 transition-colors cursor-help" />
      </div>

      {/* Main Content Layout (Flex Row with Pie on left, details on right) */}
      <div className="flex-1 flex items-center justify-between gap-4 mt-2">
        
        {/* Interactive Doughnut Chart */}
        <div className="relative w-[130px] h-[130px] flex items-center justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            className="transform -rotate-90 overflow-visible"
          >
            <defs>
              <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base dark spacer ring */}
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="transparent"
              stroke="#0b0f19"
              strokeWidth="9"
              className="opacity-40"
            />

            {/* Chart Segments */}
            {splits.map((segment, idx) => {
              const dashArray = `${(segment.percent / 100) * circumference} ${circumference}`;
              const dashOffset = circumference - (accumulatedPercent / 100) * circumference;
              
              // Increment for next segments
              accumulatedPercent += segment.percent;

              const isHovered = hoveredIndex === idx;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={r}
                  fill="transparent"
                  stroke={segment.colorCode}
                  strokeWidth={isHovered ? 12 : 8.5}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap={segment.percent > 2 ? "round" : "butt"}
                  className="transition-all duration-300 cursor-pointer origin-center hover:opacity-100"
                  style={{
                    opacity: hoveredIndex !== null && !isHovered ? 0.35 : 0.95,
                    filter: isHovered ? 'url(#glow-effect)' : 'none',
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Centered details text inside doughnut */}
          <div className="absolute flex flex-col items-center text-center justify-center pointer-events-none">
            {hoveredIndex !== null ? (
              <>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {splits[hoveredIndex].name.split(' ')[0]}
                </span>
                <span className="text-sm font-extrabold text-white font-mono leading-tight">
                  {splits[hoveredIndex].percent}%
                </span>
                <span className="text-[9px] text-slate-500 font-medium">
                  {splits[hoveredIndex].value}
                </span>
              </>
            ) : (
              <>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest leading-none mb-0.5">
                  Total GGR
                </span>
                <span className="text-sm font-extrabold text-emerald-400 font-mono">
                  ₹20,000
                </span>
                <span className="text-[8px] text-slate-500 font-semibold uppercase">
                  Audited
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend list on the right */}
        <div className="flex-1 flex flex-col justify-center space-y-1.5 max-w-[150px]">
          {splits.map((segment, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between p-1.5 rounded-lg transition-all border cursor-pointer ${
                  isHovered 
                    ? 'bg-slate-950/80 border-slate-700 shadow-md scale-[1.03]' 
                    : 'bg-transparent border-transparent hover:border-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${segment.color}`} />
                  <span className={`text-[10px] font-medium truncate ${isHovered ? 'text-white' : 'text-slate-300'}`}>
                    {segment.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 ml-1">
                  {segment.percent}%
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 border-t border-slate-850 pt-2.5 relative z-10">
        <span className="font-sans flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-500" />
          <span>Calculated by smart risk metrics</span>
        </span>
        <span className="font-mono text-amber-400 font-bold text-[9px]">
          PnL BREAKDOWN
        </span>
      </div>
    </div>
  );
}
