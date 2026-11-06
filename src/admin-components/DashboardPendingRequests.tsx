import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Clock, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { FinancialRequest } from '../adminTypes';

interface DashboardPendingRequestsProps {
  pendingRequests: FinancialRequest[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onNavigateToFinance?: () => void;
}

export default function DashboardPendingRequests({
  pendingRequests,
  onApproveRequest,
  onRejectRequest,
  onNavigateToFinance
}: DashboardPendingRequestsProps) {
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal'>('all');

  // filter requests
  const filtered = pendingRequests.filter(req => {
    if (filter === 'all') return true;
    return req.type === filter;
  });

  // Calculate quick metrics for the dashboard banner
  const pendingDeposits = pendingRequests.filter(r => r.type === 'deposit');
  const pendingWithdrawals = pendingRequests.filter(r => r.type === 'withdrawal');

  const totalDepositAmount = pendingDeposits.reduce((acc, curr) => acc + curr.amount, 0);
  const totalWithdrawalAmount = pendingWithdrawals.reduce((acc, curr) => acc + curr.amount, 0);

  // Helper to format timestamp relatively or clearly
  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="bg-obsidian-900 border border-slate-800/80 rounded-xl p-5 shadow-xl space-y-4">
      
      {/* Header and statistics banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-850 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              Payment & Withdrawal Desk
            </h3>
          </div>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Real-time cashier console. Authorize client top-ups or process withdraw requests immediately.
          </p>
        </div>

        {/* Mini quick-metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-neon">
              <TrendingDown className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 uppercase font-bold">Pending Deposits</div>
              <div className="text-xs font-mono font-bold text-white">
                ${totalDepositAmount.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">({pendingDeposits.length})</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <div className="p-1 rounded bg-rose-500/10 text-rose-neon">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 uppercase font-bold">Pending Withdraws</div>
              <div className="text-xs font-mono font-bold text-white">
                ${totalWithdrawalAmount.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">({pendingWithdrawals.length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar filter section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* Toggle filter */}
        <div className="flex bg-obsidian-950 p-1 rounded-lg border border-slate-850 self-start">
          {(['all', 'deposit', 'withdrawal'] as const).map((t) => {
            const count = t === 'all' 
              ? pendingRequests.length 
              : pendingRequests.filter(r => r.type === t).length;

            return (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-all flex items-center gap-1.5 ${
                  filter === t
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{t}s</span>
                <span className={`px-1.5 py-0.2 text-[9px] rounded-full font-mono ${
                  filter === t 
                    ? 'bg-slate-900 text-white border border-slate-700' 
                    : 'bg-slate-900 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {onNavigateToFinance && (
          <button
            type="button"
            onClick={onNavigateToFinance}
            className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5" />
            View Full Cashier History
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        )}
      </div>

      {/* Requests stack */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/20 border border-slate-900 rounded-lg p-5 flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-neon">
              <Check className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-white">All Clear! No Pending Operations</div>
            <p className="text-slate-500 text-[11px] font-sans max-w-xs">
              Every deposit and withdrawal claim has been settled. Live telemetry is listening for newly initiated transfers.
            </p>
          </div>
        ) : (
          filtered.map((req) => {
            const isDeposit = req.type === 'deposit';
            
            return (
              <div 
                key={req.id} 
                className={`bg-slate-950 border rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:bg-slate-900/40 relative overflow-hidden ${
                  isDeposit 
                    ? 'border-emerald-500/10 hover:border-emerald-500/20 shadow-sm shadow-emerald-950/5' 
                    : 'border-cyan-500/10 hover:border-cyan-500/20 shadow-sm shadow-cyan-950/5'
                }`}
              >
                {/* Left side details */}
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    isDeposit 
                      ? 'bg-emerald-500/10 text-emerald-neon border border-emerald-500/15' 
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15'
                  }`}>
                    {isDeposit ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-xs">
                        @{req.username}
                      </span>
                      <span className={`px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded ${
                        isDeposit 
                          ? 'bg-emerald-950/40 text-emerald-neon border border-emerald-900/30' 
                          : 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/30'
                      }`}>
                        {req.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5 shrink-0" />
                        {formatTimeAgo(req.requestedAt)}
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs font-sans">
                      Via <span className="font-semibold text-slate-300">{req.paymentMethod}</span>
                      {req.bankName && <span className="text-slate-500 text-[11px]"> ({req.bankName})</span>}
                    </p>
                    
                    <div className="text-[9px] text-slate-600 font-mono uppercase tracking-tight">
                      Request ID: {req.id}
                    </div>
                  </div>
                </div>

                {/* Right side interactions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-900 pt-3 sm:border-t-0 sm:pt-0">
                  {/* Amount Badge */}
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">Requested Cashout</span>
                    <span className={`text-sm sm:text-base font-extrabold font-mono tracking-tight ${
                      isDeposit ? 'text-emerald-neon' : 'text-cyan-400'
                    }`}>
                      ${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Decline */}
                    <button
                      type="button"
                      onClick={() => onRejectRequest(req.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-neon border border-rose-500/20 active:scale-95 transition-all cursor-pointer group"
                      title="Reject request and abort payment"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Approve */}
                    <button
                      type="button"
                      onClick={() => onApproveRequest(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-sans text-xs font-bold active:scale-95 transition-all hover:bg-emerald-400 shadow-md flex items-center gap-1 cursor-pointer"
                      title="Approve settlement instantly"
                    >
                      <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />
                      Approve
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Counter details */}
      <div className="flex justify-between items-center text-slate-500 text-[10px] font-sans pt-1 border-t border-slate-850/60">
        <span className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3 text-slate-500" />
          Supervisor authority clearance required
        </span>
        <span>{pendingRequests.length} actions pending</span>
      </div>

    </div>
  );
}
