import React, { useState, useEffect } from 'react';
import { TrendingUp, Info, ArrowUpRight } from 'lucide-react';

interface ChartDataPoint {
  label: string;
  displayDate: string;
  value: number; // raw value for height calculation
  displayValue: string; // value displayed in tooltip
}

export default function LoveTokenChart() {
  const [activeTab, setActiveTab] = useState<'Day' | 'Week' | 'Month'>('Month');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tokenPrice, setTokenPrice] = useState(0.80);

  // Fluctuating real-time price tick for $LOVE
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenPrice(prev => {
        const delta = (Math.random() - 0.48) * 0.004; // slight upward bias
        const next = prev + delta;
        return Math.max(0.75, Math.min(0.95, next));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Data sets for Day, Week, Month
  const dataset: Record<'Day' | 'Week' | 'Month', { data: ChartDataPoint[]; defaultIndex: number }> = {
    Day: {
      defaultIndex: 3,
      data: [
        { label: "00:00", displayDate: "26.06.2026 - 00:00", value: 95, displayValue: "₹95.00" },
        { label: "06:00", displayDate: "26.06.2026 - 06:00", value: 75, displayValue: "₹75.00" },
        { label: "12:00", displayDate: "26.06.2026 - 12:00", value: 180, displayValue: "₹180.00" },
        { label: "18:00", displayDate: "26.06.2026 - 18:00", value: 135, displayValue: "₹135.00" },
        { label: "24:00", displayDate: "26.06.2026 - 24:00", value: 240, displayValue: "₹240.00" }
      ]
    },
    Week: {
      defaultIndex: 2,
      data: [
        { label: "Mon", displayDate: "Monday, 22 Jun", value: 80, displayValue: "₹80.00" },
        { label: "Wed", displayDate: "Wednesday, 24 Jun", value: 170, displayValue: "₹170.00" },
        { label: "Fri", displayDate: "Friday, 26 Jun", value: 125, displayValue: "₹125.00" },
        { label: "Sun", displayDate: "Sunday, 28 Jun", value: 260, displayValue: "₹260.00" },
        { label: "Mon", displayDate: "Monday, 29 Jun", value: 195, displayValue: "₹195.00" }
      ]
    },
    Month: {
      defaultIndex: 2,
      data: [
        { label: "May 23'", displayDate: "15.05.2023", value: 110, displayValue: "₹110.00" },
        { label: "Jan 24'", displayDate: "12.01.2024", value: 65, displayValue: "₹65.00" },
        { label: "April 24'", displayDate: "23.04.2024", value: 172, displayValue: "₹320.00" },
        { label: "Jul 24'", displayDate: "18.07.2024", value: 315, displayValue: "₹450.00" },
        { label: "Jun 24'", displayDate: "30.09.2024", value: 210, displayValue: "₹210.00" }
      ]
    }
  };

  const { data, defaultIndex } = dataset[activeTab];
  const activeIndex = hoveredIndex !== null ? hoveredIndex : defaultIndex;

  // SVG Chart dimensions
  const width = 340;
  const height = 210;
  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 24;
  const paddingBottom = 28;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max value in chart scale is 350
  const maxVal = 350;

  // Helper scaling functions
  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - (val / maxVal) * chartHeight;

  // Generate coordinate array for points
  const points = data.map((d, idx) => ({
    x: getX(idx),
    y: getY(d.value)
  }));

  // Build Cubic Bezier spline path
  const getSplinePath = () => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      // Spline control points
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y;
      const cp2x = p0.x + 2 * (p1.x - p0.x) / 3;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const pathD = getSplinePath();

  // Create area path under spline
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  // Handle interactive mouse hover
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let closestIdx = 0;
    let minDiff = Infinity;
    points.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - x);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setHoveredIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const currentPoint = points[activeIndex];
  const currentData = data[activeIndex];

  // Tooltip positioning parameters
  const tooltipWidth = 110;
  const tooltipHeight = 54;
  let tooltipX = currentPoint.x - tooltipWidth / 2;
  let tooltipY = currentPoint.y - tooltipHeight - 12;

  // Constrain tooltip within bounds
  if (tooltipX < 10) tooltipX = 10;
  if (tooltipX + tooltipWidth > width - 10) tooltipX = width - tooltipWidth - 10;
  if (tooltipY < 5) tooltipY = currentPoint.y + 12; // place below if too high

  return (
    <div id="love-token-chart-card" className="bg-obsidian-900 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[340px] shadow-xl relative overflow-hidden select-none">

      {/* Glow highlight behind token */}
      <div className="absolute top-[-40px] left-[-40px] w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with Title, Price and Time tabs */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-black text-white tracking-wide font-display">
              ₹ REVENUE
            </h3>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-extrabold">
              <TrendingUp className="w-3 h-3" />
              <span>4.2%</span>
            </span>
          </div>
          <p className="text-xl font-bold text-slate-300 font-mono tracking-tight mt-0.5">
            ₹{tokenPrice.toFixed(4)}
          </p>
        </div>

        {/* Date Tabs selector */}
        <div className="flex items-center gap-0.5 bg-slate-950/60 p-1 rounded-xl border border-slate-850">
          {(['Day', 'Week', 'Month'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setHoveredIndex(null);
              }}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${activeTab === tab
                  ? 'bg-slate-850 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart display container */}
      <div className="relative flex-1 mt-4 flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Gradients definitions */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Horizontal Grid lines matching 300, 200, 100, 0 */}
          {[0, 100, 200, 300].map((val) => (
            <g key={val} className="opacity-40">
              <line
                x1={paddingLeft}
                y1={getY(val)}
                x2={width - paddingRight}
                y2={getY(val)}
                stroke="#1e293b"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={getY(val) + 3.5}
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Dotted target lines aligned with active dot */}
          {currentPoint && (
            <g className="transition-all duration-300">
              {/* Vertical dotted grid line */}
              <line
                x1={currentPoint.x}
                y1={paddingTop}
                x2={currentPoint.x}
                y2={paddingTop + chartHeight}
                stroke="#0284c7"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.35"
              />
              {/* Horizontal dotted grid line */}
              <line
                x1={paddingLeft}
                y1={currentPoint.y}
                x2={width - paddingRight}
                y2={currentPoint.y}
                stroke="#0284c7"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.35"
              />
            </g>
          )}

          {/* Gradient area under the curve */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#chartGradient)"
              className="transition-all duration-300"
            />
          )}

          {/* Smooth spline curve line with glow filter */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-300"
              filter="url(#glowFilter)"
            />
          )}

          {/* X Axis text labels */}
          {data.map((d, idx) => (
            <text
              key={idx}
              x={getX(idx)}
              y={height - 8}
              fill={idx === activeIndex ? '#e2e8f0' : '#475569'}
              fontSize="9"
              fontFamily="sans-serif"
              textAnchor="middle"
              className="transition-colors duration-200 font-medium"
            >
              {d.label}
            </text>
          ))}

          {/* Active indicator dot and glow */}
          {currentPoint && (
            <g className="transition-all duration-300">
              {/* Pulsing outer ring */}
              <circle
                cx={currentPoint.x}
                cy={currentPoint.y}
                r="8"
                fill="#38bdf8"
                opacity="0.25"
                className="animate-ping"
              />
              {/* Core solid active dot */}
              <circle
                cx={currentPoint.x}
                cy={currentPoint.y}
                r="4.5"
                fill="#38bdf8"
                stroke="#0b0f19"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Floating glassmorphism Tooltip container */}
          {currentPoint && currentData && (
            <g transform={`translate(${tooltipX}, ${tooltipY})`} className="transition-all duration-200">
              {/* Background card styled like screenshot */}
              <rect
                width={tooltipWidth}
                height={tooltipHeight}
                rx="12"
                fill="#0b172a"
                fillOpacity="0.85"
                stroke="#0369a1"
                strokeOpacity="0.4"
                strokeWidth="1"
                filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))"
              />
              {/* Tooltip content */}
              <text
                x={tooltipWidth / 2}
                y={18}
                fill="#64748b"
                fontSize="9"
                fontWeight="500"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                {currentData.displayDate}
              </text>
              <text
                x={tooltipWidth / 2}
                y={38}
                fill="#38bdf8"
                fontSize="12"
                fontWeight="bold"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                {currentData.displayValue}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Dynamic bottom subtitle */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 border-t border-slate-850 pt-3 relative z-10">
        <span className="font-sans flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400" />
          <span>Real-time platform utility pricing</span>
        </span>
        <span className="font-mono text-emerald-400/90 font-bold">
          LIVE FEED
        </span>
      </div>
    </div>
  );
}
