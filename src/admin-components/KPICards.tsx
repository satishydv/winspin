import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  Tv, 
  Wallet, 
  ShieldAlert, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  UserCheck 
} from 'lucide-react';
import { Player, FinancialRequest } from '../adminTypes';

interface KPICardsProps {
  players: Player[];
  pendingRequests: FinancialRequest[];
  todayGgr: number;
  monthGgrCasino: number;
  monthGgrSports: number;
  totalGgr: number;
  monthNgr: number;
  monthDeposits: number;
  monthWithdrawals: number;
  onFilterChange?: (tab: string) => void;
}

export default function KPICards({
  players,
  pendingRequests,
  todayGgr,
  monthGgrCasino,
  monthGgrSports,
  totalGgr,
  monthNgr,
  monthDeposits,
  monthWithdrawals,
  onFilterChange
}: KPICardsProps) {
  
  const onlineCount = players.filter(p => p.status === 'online').length;
  const bannedCount = players.filter(p => p.status === 'banned').length;
  
  const pendingDeposits = pendingRequests.filter(r => r.type === 'deposit' && r.status === 'pending');
  const pendingWithdrawals = pendingRequests.filter(r => r.type === 'withdrawal' && r.status === 'pending');
  
  const pendingDepositsSum = pendingDeposits.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingWithdrawalsSum = pendingWithdrawals.reduce((acc, curr) => acc + curr.amount, 0);

  const kpis = [
    {
      title: 'Today GGR',
      value: `₹${todayGgr.toLocaleString()}`,
      subtitle: `${players.length} active players today`,
      icon: TrendingUp,
      gradient: 'from-emerald-600 via-emerald-700 to-teal-800',
      border: 'border-emerald-500/20 hover:border-emerald-400/40',
      glow: 'shadow-emerald-600/25 shadow-lg hover:shadow-emerald-500/40',
      trend: '+12.4% vs yesterday',
      trendUp: true
    },
    {
      title: 'Month GGR (Casino)',
      value: `₹${monthGgrCasino.toLocaleString()}`,
      subtitle: '78.5% of platform volume',
      icon: Coins,
      gradient: 'from-indigo-650 via-indigo-700 to-purple-800',
      border: 'border-indigo-500/20 hover:border-indigo-400/40',
      glow: 'shadow-indigo-600/25 shadow-lg hover:shadow-indigo-500/40',
      trend: '+8.2% monthly pace',
      trendUp: true
    },
    {
      title: 'Month Sports GGR',
      value: `₹${monthGgrSports.toLocaleString()}`,
      subtitle: '21.5% of platform volume',
      icon: Tv,
      gradient: 'from-violet-600 via-purple-650 to-fuchsia-800',
      border: 'border-purple-500/20 hover:border-purple-400/40',
      glow: 'shadow-purple-600/25 shadow-lg hover:shadow-purple-500/40',
      trend: '-2.1% low margins',
      trendUp: false
    },
    {
      title: 'Total GGR',
      value: `₹${totalGgr.toLocaleString()}`,
      subtitle: 'All-time platform revenue',
      icon: ShieldAlert,
      gradient: 'from-fuchsia-600 via-rose-600 to-pink-700',
      border: 'border-rose-500/20 hover:border-rose-400/40',
      glow: 'shadow-rose-600/25 shadow-lg hover:shadow-rose-500/40',
      trend: 'Lifetime metrics',
      trendUp: true
    },
    {
      title: 'Month NGR',
      value: `₹${monthNgr.toLocaleString()}`,
      subtitle: 'Net GGR post-bonuses',
      icon: Wallet,
      gradient: 'from-amber-500 via-orange-550 to-rose-600',
      border: 'border-orange-500/20 hover:border-orange-400/40',
      glow: 'shadow-orange-600/25 shadow-lg hover:shadow-orange-500/40',
      trend: 'Bonus cost: ₹14,200',
      trendUp: true
    }
  ];

  const requestKpis = [
    {
      title: 'PENDING DEPOSITS',
      value: `${pendingDeposits.length}`,
      subtitle: `₹${pendingDepositsSum.toLocaleString()} total queue`,
      icon: ArrowUpRight,
      actionText: 'Authorize Deposits',
      tabKey: 'finance',
      gradient: 'from-teal-600 via-emerald-650 to-emerald-800',
      border: 'border-emerald-500/20 hover:border-emerald-400/40',
      glow: 'shadow-emerald-600/20 shadow-lg hover:shadow-emerald-500/45',
      badgeColor: 'bg-white/15 text-white font-medium border border-white/25 backdrop-blur-sm',
    },
    {
      title: 'PENDING WITHDRAWALS',
      value: `${pendingWithdrawals.length}`,
      subtitle: `₹${pendingWithdrawalsSum.toLocaleString()} total queue`,
      icon: ArrowDownRight,
      actionText: 'Authorize Withdrawals',
      tabKey: 'finance',
      gradient: 'from-rose-500 via-pink-600 to-red-600',
      border: 'border-rose-500/20 hover:border-pink-400/40',
      glow: 'shadow-rose-600/20 shadow-lg hover:shadow-rose-500/45',
      badgeColor: 'bg-white/15 text-white font-medium border border-white/25 backdrop-blur-sm',
    },
    {
      title: 'ONLINE / ACTIVE USERS',
      value: `${onlineCount}`,
      subtitle: `${players.length} cumulative`,
      icon: Users,
      actionText: 'Manage Clients',
      tabKey: 'users',
      gradient: 'from-blue-600 via-indigo-650 to-indigo-800',
      border: 'border-indigo-500/20 hover:border-indigo-400/40',
      glow: 'shadow-indigo-600/20 shadow-lg hover:shadow-indigo-500/45',
      badgeColor: 'bg-white/15 text-white font-medium border border-white/25 backdrop-blur-sm',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Prime Revenue Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`cursor-pointer transition-all duration-300 bg-gradient-to-br ${kpi.gradient} border ${kpi.border} rounded-2xl p-5 shadow-md ${kpi.glow} flex flex-col justify-between group hover:-translate-y-1 hover:scale-[1.01]`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] tracking-widest text-white/80 font-bold uppercase font-sans">
                {kpi.title}
              </span>
              <div className="h-7 w-7 rounded-lg bg-white/15 flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:bg-white/25 transition-all text-white">
                <kpi.icon className="h-4 w-4" />
              </div>
            </div>
            
            <div className="my-3">
              <span className="text-2xl font-bold tracking-tight font-display text-white drop-shadow-sm block">
                {kpi.value}
              </span>
              <p className="text-white/85 text-[11px] font-sans mt-0.5 font-medium">
                {kpi.subtitle}
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-white/10">
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold font-sans tracking-wide ${kpi.trendUp ? 'bg-white/20 text-emerald-100 border border-white/10' : 'bg-white/20 text-rose-100 border border-white/10'}`}>
                {kpi.trendUp ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-300" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-rose-300" />
                )}
                <span>{kpi.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actionable Telemetry & Queues */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {requestKpis.map((req, idx) => (
          <div
            key={idx}
            className={`transition-all duration-300 bg-gradient-to-br ${req.gradient} border ${req.border} rounded-2xl p-5 flex items-center justify-between shadow-md ${req.glow} group hover:-translate-y-1 hover:scale-[1.01]`}
          >
            <div className="space-y-3">
              <span className="text-[10px] tracking-wider text-white/80 font-bold font-sans block uppercase">
                {req.title}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold tracking-tight font-display text-white">
                  {req.value}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans ${req.badgeColor}`}>
                  {req.subtitle}
                </span>
              </div>
              
              {onFilterChange && (
                <button
                  onClick={() => onFilterChange(req.tabKey)}
                  className="mt-2 flex items-center gap-1 text-[11px] font-medium text-white bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/20 backdrop-blur-sm transition-all py-1.5 px-3 rounded-lg shadow-sm"
                >
                  {req.actionText}
                  <ArrowUpRight className="h-3 w-3 ml-0.5 opacity-80" />
                </button>
              )}
            </div>
            <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center border border-white/15 backdrop-blur-sm text-white shadow-inner">
              <req.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
