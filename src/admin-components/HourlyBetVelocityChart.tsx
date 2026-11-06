import React, { useState, useEffect } from 'react';
import { Activity, Info, BarChart2 } from 'lucide-react';

interface HourlyData {
  hour: string;
  betsCount: number;
  volume: string;
  activeUsers: number;
}

export default function HourlyBetVelocityChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [livePulse, setLivePulse] = useState(false);

  // Simple live telemetry pulse simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLivePulse(true);
      const reset = setTimeout(() => setLivePulse(false), 800);
      return () => clearTimeout(reset);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const data: HourlyData[] = [
    { hour: '02:00', betsCount: 38, volume: '₹1,920', activeUsers: 14 },
    { hour: '06:00', betsCount: 18, volume: '₹950', activeUsers: 8 },
    { hour: '10:00', betsCount: 85, volume: '₹4,100', activeUsers: 45 },
    { hour: '14:00', betsCount: 142, volume: '₹8,400', activeUsers: 92 },
    { hour: '18:00', betsCount: 105, volume: '₹5,800', activeUsers: 70 },
    { hour: '22:00', betsCount: 225, volume: '₹14,900', activeUsers: 135 },
    { hour: '24:00', betsCount: 170, volume: '₹11,200', activeUsers: 102 }
  ];

  const maxBets = 250; // max scale
  const height = 120;
  const width = 340;
  const paddingLeft = 30;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 20;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingLeft - paddingRight;

  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - (val / maxBets) * chartHeight;

  const activeIndex = hoveredIndex !== null ? hoveredIndex : 5; // default to 22:00

  return (
    <div id="hourly-bet-velocity-card" className="bg-obsidian-900 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden select-none min-h-[300px] h-[340px]">
      
      {/* Glow highlight */}
      <div className="absolute bottom-[-40px] left-[-40px] w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
            <Activity className={`w-4 h-4 text-indigo-400 ${livePulse ? 'scale-110 text-indigo-300' : ''} transition-all duration-300`} />
            Platform Traffic Rate
          </h3>
          <p className="text-slate-400 text-[11px] font-sans mt-0.5">
            Hourly casino bets count & stake volume
          </p>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 animate-pulse">
          ● 12.4s latency
        </span>
      </div>

      {/* Bar Chart drawing Area */}
      <div className="relative flex-1 mt-4 flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 100, 200].map((val) => (
            <g key={val} className="opacity-30">
              <line
                x1={paddingLeft}
                y1={getY(val)}
                x2={width - paddingRight}
                y2={getY(val)}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <text
                x={paddingLeft - 6}
                y={getY(val) + 3}
                fill="#475569"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Render columns */}
          {data.map((d, idx) => {
            const barWidth = 16;
            const barX = getX(idx) - barWidth / 2;
            const barY = getY(d.betsCount);
            const barHeight = Math.max(4, paddingTop + chartHeight - barY);
            const isSelected = activeIndex === idx;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Transparent hover capture zone */}
                <rect
                  x={getX(idx) - 20}
                  y={paddingTop}
                  width="40"
                  height={chartHeight}
                  fill="transparent"
                />

                {/* Main Visual Column bar */}
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx="3"
                  fill={isSelected ? 'url(#barGradActive)' : 'url(#barGrad)'}
                  className="transition-all duration-300"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 4px rgba(129, 140, 248, 0.4))' : 'none',
                    opacity: hoveredIndex !== null && !isSelected ? 0.4 : 0.95
                  }}
                />

                {/* Subtle highlight top cap */}
                {isSelected && (
                  <rect
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height="1.5"
                    fill="#e0e7ff"
                    className="transition-all"
                  />
                )}
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((d, idx) => (
            <text
              key={idx}
              x={getX(idx)}
              y={height - 4}
              fill={idx === activeIndex ? '#94a3b8' : '#334155'}
              fontSize="8.5"
              fontFamily="sans-serif"
              textAnchor="middle"
              className="transition-colors duration-200 font-bold"
            >
              {d.hour}
            </text>
          ))}
        </svg>

        {/* Hover detail widget (Floating on top absolute overlay in the center) */}
        <div className="absolute right-0 top-0 bg-slate-950/80 border border-indigo-500/20 rounded-xl p-2.5 flex flex-col justify-center min-w-[105px] text-right shadow-lg pointer-events-none transition-all duration-300 animate-fadeIn">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
            Time: {data[activeIndex].hour}
          </span>
          <span className="text-sm font-bold text-indigo-300 font-mono block leading-none my-0.5">
            {data[activeIndex].betsCount} Bets
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold font-mono block">
            Vol: {data[activeIndex].volume}
          </span>
          <span className="text-[8px] text-slate-400 block mt-0.5">
            {data[activeIndex].activeUsers} online players
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 border-t border-slate-850 pt-2.5 relative z-10">
        <span className="font-sans flex items-center gap-1">
          <BarChart2 className="w-3 h-3 text-slate-500" />
          <span>Syncing 5m average aggregates</span>
        </span>
        <span className="font-mono text-indigo-400 font-bold text-[9px]">
          VELOCITY FEED
        </span>
      </div>
    </div>
  );
}
