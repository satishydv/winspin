import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Calendar, 
  Filter, 
  ChevronDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Percent, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Gift, 
  Award, 
  Briefcase, 
  Gamepad2, 
  Download, 
  ChevronRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { FinancialRequest, Player, LiveBet, Agent } from '../adminTypes';

interface ReportsViewProps {
  pendingRequests: FinancialRequest[];
  completedHistory: FinancialRequest[];
  players: Player[];
  agents: Agent[];
  bets: LiveBet[];
  activeSubTab: 'payment-reports' | 'ggr-reports' | 'bonus-reports';
  onSubTabChange: (tab: 'payment-reports' | 'ggr-reports' | 'bonus-reports') => void;
}

// Generate high quality mock data over the last 30 days (June 1, 2026 to June 27, 2026) 
// to ensure the 7 days and 30 days filters look stunningly populated.
const HISTORIC_PAYMENTS: FinancialRequest[] = [
  { id: 'TX-901', username: 'alex_vip', amount: 5000, type: 'deposit', status: 'approved', paymentMethod: 'USDT (TRC-20)', bankName: 'Crypto Network', requestedAt: '2026-06-27T10:30:00Z' },
  { id: 'TX-902', username: 'rahul_mumbai', amount: 2000, type: 'withdrawal', status: 'approved', paymentMethod: 'UPI Instant', bankName: 'HDFC Bank', requestedAt: '2026-06-26T18:45:00Z' },
  { id: 'TX-903', username: 'priya_delhi', amount: 3500, type: 'deposit', status: 'approved', paymentMethod: 'NetBanking', bankName: 'SBI', requestedAt: '2026-06-25T14:20:00Z' },
  { id: 'TX-904', username: 'kabir_sharma', amount: 1500, type: 'deposit', status: 'rejected', paymentMethod: 'UPI Instant', bankName: 'GooglePay', requestedAt: '2026-06-24T09:15:00Z' },
  { id: 'TX-905', username: 'sneha_patel', amount: 8000, type: 'withdrawal', status: 'approved', paymentMethod: 'IMPS Bank Transfer', bankName: 'ICICI Bank', requestedAt: '2026-06-23T11:00:00Z' },
  { id: 'TX-906', username: 'vikram_singh', amount: 12000, type: 'deposit', status: 'approved', paymentMethod: 'USDT (ERC-20)', bankName: 'Trust Wallet', requestedAt: '2026-06-21T21:40:00Z' },
  { id: 'TX-907', username: 'alex_vip', amount: 4500, type: 'withdrawal', status: 'rejected', paymentMethod: 'UPI Instant', bankName: 'PhonePe', requestedAt: '2026-06-20T16:10:00Z' },
  { id: 'TX-908', username: 'amit_pune', amount: 3000, type: 'deposit', status: 'approved', paymentMethod: 'NetBanking', bankName: 'Axis Bank', requestedAt: '2026-06-18T08:35:00Z' },
  { id: 'TX-909', username: 'neha_gupta', amount: 1000, type: 'deposit', status: 'approved', paymentMethod: 'UPI Instant', bankName: 'Paytm UPI', requestedAt: '2026-06-15T12:05:00Z' },
  { id: 'TX-910', username: 'rahul_mumbai', amount: 6000, type: 'withdrawal', status: 'approved', paymentMethod: 'IMPS Bank Transfer', bankName: 'HDFC Bank', requestedAt: '2026-06-12T17:50:00Z' },
  { id: 'TX-911', username: 'sneha_patel', amount: 4000, type: 'deposit', status: 'approved', paymentMethod: 'USDT (TRC-20)', bankName: 'Crypto Network', requestedAt: '2026-06-08T09:00:00Z' },
  { id: 'TX-912', username: 'kabir_sharma', amount: 2500, type: 'withdrawal', status: 'approved', paymentMethod: 'UPI Instant', bankName: 'SBI', requestedAt: '2026-06-05T15:30:00Z' },
  { id: 'TX-913', username: 'vikram_singh', amount: 9500, type: 'deposit', status: 'approved', paymentMethod: 'NetBanking', bankName: 'ICICI Bank', requestedAt: '2026-06-02T11:15:00Z' },
  { id: 'TX-914', username: 'amit_pune', amount: 2000, type: 'withdrawal', status: 'approved', paymentMethod: 'UPI Instant', bankName: 'Paytm UPI', requestedAt: '2026-06-01T14:40:00Z' },
];

const HISTORIC_GGR_CATEGORIES = [
  { category: 'Slots', bets: 450000, wins: 410000, defaultPercent: 45 },
  { category: 'Sportsbook', bets: 280000, wins: 258000, defaultPercent: 21.5 },
  { category: 'Roulette Live', bets: 190000, wins: 172000, defaultPercent: 20 },
  { category: 'Crash Turbo', bets: 120000, wins: 111000, defaultPercent: 10 },
  { category: 'VIP Blackjack', bets: 85000, wins: 81500, defaultPercent: 3.5 },
];

const HISTORIC_BONUS_RECORDS = [
  { id: 'B-101', username: 'alex_vip', schemeName: '1st Deposit 100% Bonus', type: 'FIRST_DEP', amount: 5000, progress: 25000, target: 25000, status: 'Unlocked', date: '2026-06-27T08:00:00Z' },
  { id: 'B-102', username: 'rahul_mumbai', schemeName: 'Register & Get Free Bonus', type: 'WELCOME', amount: 567, progress: 5670, target: 5670, status: 'Unlocked', date: '2026-06-26T14:30:00Z' },
  { id: 'B-103', username: 'priya_delhi', schemeName: 'Daily Deposit Bonus', type: 'DAILY_DEP', amount: 350, progress: 1200, target: 1750, status: 'In Progress', date: '2026-06-25T11:15:00Z' },
  { id: 'B-104', username: 'sneha_patel', schemeName: '1st Deposit 100% Bonus', type: 'FIRST_DEP', amount: 4000, progress: 18000, target: 20000, status: 'In Progress', date: '2026-06-24T17:40:00Z' },
  { id: 'B-105', username: 'amit_pune', schemeName: '5% Bonus on Losses Below ₹50,000', type: 'LOSS_BELOW', amount: 1500, progress: 7500, target: 7500, status: 'Unlocked', date: '2026-06-22T09:00:00Z' },
  { id: 'B-106', username: 'neha_gupta', schemeName: 'Register & Get Free Bonus', type: 'WELCOME', amount: 567, progress: 5670, target: 5670, status: 'Unlocked', date: '2026-06-19T10:15:00Z' },
  { id: 'B-107', username: 'kabir_sharma', schemeName: 'Daily Deposit Bonus', type: 'DAILY_DEP', amount: 250, progress: 250, target: 1250, status: 'Expired', date: '2026-06-14T13:20:00Z' },
  { id: 'B-108', username: 'vikram_singh', schemeName: '10% Bonus on Losses Above ₹50,000', type: 'LOSS_ABOVE', amount: 6500, progress: 32500, target: 32500, status: 'Unlocked', date: '2026-06-10T11:00:00Z' },
  { id: 'B-109', username: 'alex_vip', schemeName: 'Daily Deposit Bonus', type: 'DAILY_DEP', amount: 450, progress: 2250, target: 2250, status: 'Unlocked', date: '2026-06-05T16:45:00Z' },
  { id: 'B-110', username: 'priya_delhi', schemeName: 'Register & Get Free Bonus', type: 'WELCOME', amount: 567, progress: 2400, target: 5670, status: 'In Progress', date: '2026-06-02T10:00:00Z' },
];

export default function ReportsView({
  pendingRequests,
  completedHistory,
  players,
  agents,
  bets,
  activeSubTab,
  onSubTabChange
}: ReportsViewProps) {
  // Preset selection: 'today' | '7days' | '30days' | 'custom'
  const [datePreset, setDatePreset] = useState<'today' | '7days' | '30days' | 'custom'>('7days');
  
  // Custom date filter values
  const [startDate, setStartDate] = useState<string>('2026-06-20');
  const [endDate, setEndDate] = useState<string>('2026-06-27');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Payment filter overrides
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<'all' | 'deposit' | 'withdrawal'>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Bonus filter overrides
  const [bonusStatusFilter, setBonusStatusFilter] = useState<'all' | 'In Progress' | 'Unlocked' | 'Expired'>('all');

  // Force trigger filters when startDate or endDate changes
  const activeDateRange = useMemo(() => {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    let start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    if (datePreset === 'today') {
      const today = new Date('2026-06-27'); // reference date matching prompt local time 2026-06-27
      today.setHours(0, 0, 0, 0);
      const tonight = new Date('2026-06-27');
      tonight.setHours(23, 59, 59, 999);
      return { start: today, end: tonight };
    } else if (datePreset === '7days') {
      const past7 = new Date('2026-06-27');
      past7.setDate(past7.getDate() - 7);
      past7.setHours(0, 0, 0, 0);
      const tonight = new Date('2026-06-27');
      tonight.setHours(23, 59, 59, 999);
      return { start: past7, end: tonight };
    } else if (datePreset === '30days') {
      const past30 = new Date('2026-06-27');
      past30.setDate(past30.getDate() - 30);
      past30.setHours(0, 0, 0, 0);
      const tonight = new Date('2026-06-27');
      tonight.setHours(23, 59, 59, 999);
      return { start: past30, end: tonight };
    }

    return { start, end };
  }, [datePreset, startDate, endDate]);

  // Combine and consolidate real-time state with historical mock data for Payment reports
  const allConsolidatedPayments = useMemo(() => {
    // Collect from parent state
    const parentCompleted = completedHistory.map(req => ({
      ...req,
      requestedAt: req.requestedAt || '2026-06-27T12:00:00Z'
    }));
    const parentPending = pendingRequests.map(req => ({
      ...req,
      requestedAt: req.requestedAt || '2026-06-27T12:00:00Z'
    }));

    // Join with historic logs
    const combined = [...parentPending, ...parentCompleted, ...HISTORIC_PAYMENTS];
    
    // Sort descending by date
    return combined.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }, [pendingRequests, completedHistory]);

  // Filter payment records based on dates & selected types
  const filteredPayments = useMemo(() => {
    return allConsolidatedPayments.filter(item => {
      const itemDate = new Date(item.requestedAt);
      const inDateRange = itemDate >= activeDateRange.start && itemDate <= activeDateRange.end;
      
      const matchesSearch = searchQuery.trim() === '' || 
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = paymentTypeFilter === 'all' || item.type === paymentTypeFilter;
      const matchesStatus = paymentStatusFilter === 'all' || item.status === paymentStatusFilter;

      return inDateRange && matchesSearch && matchesType && matchesStatus;
    });
  }, [allConsolidatedPayments, activeDateRange, searchQuery, paymentTypeFilter, paymentStatusFilter]);

  // Dynamic values calculation for GGR Reports
  // Gross Gaming Revenue is GGR = Bets - Wins
  // Category splits with combined active parent bets + standard high statistics distribution
  const ggrData = useMemo(() => {
    // Start with default values scaled by date preset
    let scaleMultiplier = 1;
    if (datePreset === 'today') scaleMultiplier = 0.05;
    else if (datePreset === '7days') scaleMultiplier = 0.25;
    else if (datePreset === '30days') scaleMultiplier = 1.0;

    // Filter parent bets that match date range
    const matchingBets = bets.filter(b => {
      // Parse ISO string or fallback to today
      const betDate = b.timestamp.includes('T') ? new Date(b.timestamp) : new Date('2026-06-27T12:00:00Z');
      return betDate >= activeDateRange.start && betDate <= activeDateRange.end;
    });

    const categories = HISTORIC_GGR_CATEGORIES.map(cat => {
      const baseBets = cat.bets * scaleMultiplier;
      const baseWins = cat.wins * scaleMultiplier;

      // Add parent active bets count
      const categoryBetsList = matchingBets.filter(b => b.gameType.toLowerCase().startsWith(cat.category.toLowerCase().split(' ')[0].toLowerCase()));
      const liveBetSum = categoryBetsList.reduce((acc, b) => acc + b.betAmount, 0);
      const liveWinSum = categoryBetsList.reduce((acc, b) => acc + b.winAmount, 0);

      const totalBets = Math.round(baseBets + liveBetSum);
      const totalWins = Math.round(baseWins + liveWinSum);
      const ggr = totalBets - totalWins;
      const margin = totalBets > 0 ? (ggr / totalBets) * 100 : 0;

      return {
        category: cat.category,
        bets: totalBets,
        wins: totalWins,
        ggr: ggr,
        margin: margin
      };
    });

    return categories;
  }, [bets, activeDateRange, datePreset]);

  // Top player GGR leaders for current filtered scope
  const playerGgrLeaders = useMemo(() => {
    return players.map(p => {
      // Calculate dynamic variation based on date multiplier
      let multiplier = 1;
      if (datePreset === 'today') multiplier = 0.04;
      else if (datePreset === '7days') multiplier = 0.28;

      const betsEst = Math.round(p.totalBet * multiplier);
      const winsEst = Math.round(p.totalWin * multiplier);
      const ggrEst = betsEst - winsEst;

      return {
        username: p.username,
        country: p.country,
        bets: betsEst,
        wins: winsEst,
        ggr: ggrEst,
        status: p.status
      };
    }).sort((a, b) => b.ggr - a.ggr).slice(0, 8);
  }, [players, datePreset]);

  // Consolidate Bonus data
  const filteredBonuses = useMemo(() => {
    return HISTORIC_BONUS_RECORDS.filter(item => {
      const itemDate = new Date(item.date);
      const inDateRange = itemDate >= activeDateRange.start && itemDate <= activeDateRange.end;
      
      const matchesSearch = searchQuery.trim() === '' || 
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.schemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = bonusStatusFilter === 'all' || item.status === bonusStatusFilter;

      return inDateRange && matchesSearch && matchesStatus;
    });
  }, [activeDateRange, searchQuery, bonusStatusFilter]);

  // Aggregate stats based on current filters
  const paymentAggregates = useMemo(() => {
    let depositsTotal = 0;
    let withdrawalsTotal = 0;
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    filteredPayments.forEach(item => {
      if (item.status === 'pending') pendingCount++;
      else if (item.status === 'approved') approvedCount++;
      else if (item.status === 'rejected') rejectedCount++;

      if (item.type === 'deposit' && item.status === 'approved') {
        depositsTotal += item.amount;
      } else if (item.type === 'withdrawal' && item.status === 'approved') {
        withdrawalsTotal += item.amount;
      }
    });

    return {
      depositsTotal,
      withdrawalsTotal,
      pendingCount,
      approvedCount,
      rejectedCount,
      netInflow: depositsTotal - withdrawalsTotal
    };
  }, [filteredPayments]);

  const ggrAggregates = useMemo(() => {
    let totalBets = 0;
    let totalWins = 0;
    
    ggrData.forEach(c => {
      totalBets += c.bets;
      totalWins += c.wins;
    });

    const netGgr = totalBets - totalWins;
    const houseMargin = totalBets > 0 ? (netGgr / totalBets) * 100 : 0;

    return {
      totalBets,
      totalWins,
      netGgr,
      houseMargin
    };
  }, [ggrData]);

  const bonusAggregates = useMemo(() => {
    let totalPaid = 0;
    let activeEnrollments = 0;
    let unlockedClaims = 0;

    filteredBonuses.forEach(b => {
      if (b.status === 'Unlocked') {
        unlockedClaims++;
        totalPaid += b.amount;
      } else if (b.status === 'In Progress') {
        activeEnrollments++;
      }
    });

    return {
      totalPaid,
      activeEnrollments,
      unlockedClaims,
      avgBonus: filteredBonuses.length > 0 ? totalPaid / filteredBonuses.length : 0
    };
  }, [filteredBonuses]);

  // Fully-featured client side CSV Exporter
  const handleExportCSV = () => {
    let csvContent = '';
    let fileName = '';

    if (activeSubTab === 'payment-reports') {
      fileName = `Payment_Report_${datePreset}_${startDate}_to_${endDate}.csv`;
      // Header row
      csvContent += 'Transaction ID,Username,Type,Amount,Status,Payment Method,Bank Name,Requested Date\n';
      filteredPayments.forEach(p => {
        csvContent += `"${p.id}","${p.username}","${p.type.toUpperCase()}",${p.amount},"${p.status.toUpperCase()}","${p.paymentMethod}","${p.bankName || 'N/A'}","${p.requestedAt}"\n`;
      });
    } else if (activeSubTab === 'ggr-reports') {
      fileName = `GGR_Analytics_${datePreset}_${startDate}_to_${endDate}.csv`;
      csvContent += 'Game Category,Total Bets,Total Wins,Net Gross Gaming Revenue (GGR),House Hold Margin (%)\n';
      ggrData.forEach(c => {
        csvContent += `"${c.category}",${c.bets},${c.wins},${c.ggr},${c.margin.toFixed(2)}%\n`;
      });
      csvContent += `\nSUMMARY,${ggrAggregates.totalBets},${ggrAggregates.totalWins},${ggrAggregates.netGgr},${ggrAggregates.houseMargin.toFixed(2)}%\n`;
    } else if (activeSubTab === 'bonus-reports') {
      fileName = `Bonus_Settlements_${datePreset}_${startDate}_to_${endDate}.csv`;
      csvContent += 'Settlement ID,Username,Campaign Name,Campaign Type,Bonus Paid,Wagered Progress,Target Requirement,Wager Status,Assigned Date\n';
      filteredBonuses.forEach(b => {
        csvContent += `"${b.id}","${b.username}","${b.schemeName}","${b.type}",${b.amount},${b.progress},${b.target},"${b.status}","${b.date}"\n`;
      });
    }

    // Trigger real download stream
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper date-preset click handler
  const selectPreset = (preset: 'today' | '7days' | '30days' | 'custom') => {
    setDatePreset(preset);
    if (preset === 'today') {
      setStartDate('2026-06-27');
      setEndDate('2026-06-27');
    } else if (preset === '7days') {
      setStartDate('2026-06-20');
      setEndDate('2026-06-27');
    } else if (preset === '30days') {
      setStartDate('2026-05-28');
      setEndDate('2026-06-27');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. VIEW HEADER */}
      <div className="p-5 bg-obsidian-900 border border-slate-800/80 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-black font-display text-white uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-indigo-400" />
              Administrative Intelligence Reports
            </h2>
            <p className="text-slate-400 text-xs font-sans max-w-xl">
              Access real-time audit ledger filters for accounting, banking withdrawals, GGR revenue yield margin splits, and marketing promo payouts.
            </p>
          </div>

          {/* Quick Subtab selectors */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 text-white self-stretch md:self-auto shrink-0">
            <button
              onClick={() => onSubTabChange('payment-reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'payment-reports'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Payment Reports
            </button>
            <button
              onClick={() => onSubTabChange('ggr-reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'ggr-reports'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GGR Reports
            </button>
            <button
              onClick={() => onSubTabChange('bonus-reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'bonus-reports'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bonus Reports
            </button>
          </div>
        </div>
      </div>

      {/* 2. SHARED FILTER BAR */}
      <div className="p-4 bg-obsidian-900 border border-slate-800/80 rounded-xl shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
            {(['today', '7days', '30days', 'custom'] as const).map(p => {
              const labels = { today: 'Today', '7days': '7 Days', '30days': '30 Days', custom: 'Custom Range' };
              return (
                <button
                  key={p}
                  onClick={() => selectPreset(p)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${
                    datePreset === p
                      ? 'bg-slate-850 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>

          {/* Date range inputs */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-850">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={startDate}
                disabled={datePreset !== 'custom'}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDatePreset('custom');
                }}
                className="bg-transparent border-none outline-none text-slate-300 font-mono text-[11px] disabled:opacity-50"
              />
            </div>
            <span className="text-slate-600 text-[11px]">to</span>
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-850">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={endDate}
                disabled={datePreset !== 'custom'}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDatePreset('custom');
                }}
                className="bg-transparent border-none outline-none text-slate-300 font-mono text-[11px] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850 flex-1 min-w-[180px] max-w-xs">
            <Search className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Search by username, id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none w-full"
            />
          </div>

          {/* Export and Refresh action triggers */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-900 hover:from-emerald-500 hover:to-emerald-800 border border-emerald-500/20 text-white font-bold text-xs rounded-xl tracking-wider shadow-md transition-all hover:shadow-emerald-500/10 active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

        </div>

        {/* Dynamic Context Tag line */}
        <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-850/60 pt-2.5">
          <span>
            Active Date Scope: <b className="text-slate-400 font-mono">{activeDateRange.start.toLocaleDateString()}</b> to <b className="text-slate-400 font-mono">{activeDateRange.end.toLocaleDateString()}</b>
          </span>
          <span className="uppercase text-indigo-400 font-mono font-bold tracking-widest text-[9px]">
            {datePreset} view
          </span>
        </div>
      </div>


      {/* 3. REPORT VIEWS PAGES RENDERING */}

      {/* ===================== PAYMENT REPORTS ===================== */}
      {activeSubTab === 'payment-reports' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Deposited</p>
                <h4 className="text-lg font-extrabold text-emerald-400 font-mono mt-1">${paymentAggregates.depositsTotal.toLocaleString()}</h4>
                <p className="text-[9px] text-slate-500 mt-1">Sum of approved deposits</p>
              </div>
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Withdrawn</p>
                <h4 className="text-lg font-extrabold text-rose-400 font-mono mt-1">${paymentAggregates.withdrawalsTotal.toLocaleString()}</h4>
                <p className="text-[9px] text-slate-500 mt-1">Sum of approved claims</p>
              </div>
              <div className="h-10 w-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400">
                <ArrowDownRight className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Net Net Inflow</p>
                <h4 className={`text-lg font-extrabold font-mono mt-1 ${paymentAggregates.netInflow >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                  ${paymentAggregates.netInflow.toLocaleString()}
                </h4>
                <p className="text-[9px] text-slate-500 mt-1">Net deposit vs withdraw balance</p>
              </div>
              <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Approved / Pending / Rejected</p>
                <div className="flex items-center gap-2 mt-2 font-mono text-xs font-bold text-slate-300">
                  <span className="text-emerald-400">{paymentAggregates.approvedCount}A</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-amber-400">{paymentAggregates.pendingCount}P</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-rose-400">{paymentAggregates.rejectedCount}R</span>
                </div>
                <p className="text-[9px] text-slate-500 mt-1">Transaction claims ledger status</p>
              </div>
              <div className="h-10 w-10 bg-slate-500/10 rounded-xl flex items-center justify-center text-slate-400">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* List and Table Grid filters */}
          <div className="bg-obsidian-900 border border-slate-800 rounded-2xl overflow-hidden p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Payment Audit Ledger Table</h3>
                <p className="text-slate-500 text-[11px]">Displaying {filteredPayments.length} transactions match current scope</p>
              </div>

              {/* Sub filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                  {(['all', 'deposit', 'withdrawal'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setPaymentTypeFilter(t)}
                      className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded transition-all ${
                        paymentTypeFilter === t
                          ? 'bg-slate-850 text-white'
                          : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                  {(['all', 'approved', 'pending', 'rejected'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setPaymentStatusFilter(s)}
                      className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded transition-all ${
                        paymentStatusFilter === s
                          ? 'bg-slate-850 text-white'
                          : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-950/40">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-[10px] text-slate-400 uppercase font-mono tracking-wider font-extrabold bg-slate-950/80">
                    <th className="py-3 px-4">TX ID</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Method & Node</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Requested At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs font-sans">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">
                        No transactions found matching active presets. Try broadening date selectors.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => {
                      const isDeposit = p.type === 'deposit';
                      const isApproved = p.status === 'approved';
                      const isPending = p.status === 'pending';
                      const isRejected = p.status === 'rejected';

                      let statusBadge = '';
                      if (isApproved) statusBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                      if (isPending) statusBadge = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                      if (isRejected) statusBadge = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';

                      return (
                        <tr key={p.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-300">{p.id}</td>
                          <td className="py-2.5 px-4 font-bold text-white">@{p.username}</td>
                          <td className="py-2.5 px-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase rounded px-1.5 py-0.5 ${
                              isDeposit ? 'bg-emerald-500/5 text-emerald-400' : 'bg-rose-500/5 text-rose-400'
                            }`}>
                              {isDeposit ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {p.type}
                            </span>
                          </td>
                          <td className={`py-2.5 px-4 text-right font-mono font-black text-sm ${
                            isDeposit ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            ${p.amount.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            <span className="block text-xs font-medium">{p.paymentMethod}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">{p.bankName || 'AuraInstant Settlement'}</span>
                          </td>
                          <td className="py-2.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-extrabold ${statusBadge}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right text-slate-500 font-mono text-[10px]">
                            {new Date(p.requestedAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}


      {/* ===================== GGR REPORTS ===================== */}
      {activeSubTab === 'ggr-reports' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Active Bets</p>
                <h4 className="text-lg font-extrabold text-blue-400 font-mono mt-1">${ggrAggregates.totalBets.toLocaleString()}</h4>
                <p className="text-[9px] text-slate-500 mt-1">Stakes placed by users</p>
              </div>
              <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                <Gamepad2 className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total User Wins</p>
                <h4 className="text-lg font-extrabold text-indigo-400 font-mono mt-1">${ggrAggregates.totalWins.toLocaleString()}</h4>
                <p className="text-[9px] text-slate-500 mt-1">Payout returns won</p>
              </div>
              <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                <Award className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">House GGR (Yield)</p>
                <h4 className="text-lg font-extrabold text-emerald-400 font-mono mt-1">${ggrAggregates.netGgr.toLocaleString()}</h4>
                <p className="text-[9px] text-slate-500 mt-1">Gross Gaming Revenue (Bets - Wins)</p>
              </div>
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">House hold Margin</p>
                <h4 className="text-lg font-extrabold text-amber-400 font-mono mt-1">{ggrAggregates.houseMargin.toFixed(2)}%</h4>
                <p className="text-[9px] text-slate-500 mt-1">Hold percentage ratio</p>
              </div>
              <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
                <Percent className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Category split table */}
            <div className="lg:col-span-2 bg-obsidian-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">GGR Category Performance Split</h3>
                <p className="text-slate-500 text-[11px]">Calculated from rolling aggregates across each game variant</p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-950/40">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-[10px] text-slate-400 uppercase font-mono tracking-wider font-extrabold bg-slate-950/80">
                      <th className="py-3 px-4">Gaming Category</th>
                      <th className="py-3 px-4 text-right">Total Stakes</th>
                      <th className="py-3 px-4 text-right">Player Returns</th>
                      <th className="py-3 px-4 text-right">Net GGR</th>
                      <th className="py-3 px-4 text-right">Hold Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-xs font-sans">
                    {ggrData.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-3 px-4 text-white font-bold flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            c.category === 'Slots' ? 'bg-amber-500' :
                            c.category === 'Sportsbook' ? 'bg-blue-500' :
                            c.category === 'Roulette Live' ? 'bg-rose-500' :
                            c.category === 'Crash Turbo' ? 'bg-purple-500' : 'bg-indigo-500'
                          }`} />
                          {c.category}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-300">${c.bets.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-400">${c.wins.toLocaleString()}</td>
                        <td className={`py-3 px-4 text-right font-mono font-extrabold text-sm ${c.ggr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ${c.ggr.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-300">
                          {c.margin.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top contributors */}
            <div className="bg-obsidian-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Player GGR Leaders</h3>
                <p className="text-slate-500 text-[11px]">Ranked by highest net GGR contribution to house</p>
              </div>

              <div className="space-y-3">
                {playerGgrLeaders.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800/80 transition-all">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-slate-850 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                        #{idx + 1}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">@{p.username}</span>
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">{p.country}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 font-mono block">${p.ggr.toLocaleString()}</span>
                      <span className="text-[9px] text-slate-500 block">Stakes: ${p.bets.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}


      {/* ===================== BONUS REPORTS ===================== */}
      {activeSubTab === 'bonus-reports' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Bonus Paid</p>
                <h4 className="text-lg font-extrabold text-gold-500 font-mono mt-1">${bonusAggregates.totalPaid.toLocaleString()}</h4>
                <p className="text-[9px] text-slate-500 mt-1">Unlocked marketing settlements</p>
              </div>
              <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-gold-500">
                <Gift className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Active Enrollments</p>
                <h4 className="text-lg font-extrabold text-blue-400 font-mono mt-1">{bonusAggregates.activeEnrollments}</h4>
                <p className="text-[9px] text-slate-500 mt-1">Wager progress rolling now</p>
              </div>
              <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Unlocked Claims</p>
                <h4 className="text-lg font-extrabold text-emerald-400 font-mono mt-1">{bonusAggregates.unlockedClaims}</h4>
                <p className="text-[9px] text-slate-500 mt-1">Succeeded target rollover</p>
              </div>
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-obsidian-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Avg Settlement Size</p>
                <h4 className="text-lg font-extrabold text-indigo-400 font-mono mt-1">${Math.round(bonusAggregates.avgBonus).toLocaleString()}</h4>
                <p className="text-[9px] text-slate-500 mt-1">Per claim unlock payout size</p>
              </div>
              <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* List and Table Grid filters */}
          <div className="bg-obsidian-900 border border-slate-800 rounded-2xl overflow-hidden p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Bonus Settlements Audit Ledger</h3>
                <p className="text-slate-500 text-[11px]">Displaying {filteredBonuses.length} promotional claim statuses</p>
              </div>

              {/* Status Subfilter */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                {(['all', 'In Progress', 'Unlocked', 'Expired'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setBonusStatusFilter(s)}
                    className={`px-3 py-1 text-[10px] uppercase font-bold rounded transition-all ${
                      bonusStatusFilter === s
                        ? 'bg-slate-850 text-white shadow-sm'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    {s === 'all' ? 'all' : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-950/40">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-[10px] text-slate-400 uppercase font-mono tracking-wider font-extrabold bg-slate-950/80">
                    <th className="py-3 px-4">Settlement ID</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Campaign Name</th>
                    <th className="py-3 px-4">Bonus Type</th>
                    <th className="py-3 px-4 text-right">Bonus Paid</th>
                    <th className="py-3 px-4 text-right">Rollover Progress</th>
                    <th className="py-3 px-4">Wager Status</th>
                    <th className="py-3 px-4 text-right">Assigned Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs font-sans">
                  {filteredBonuses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-500">
                        No promotional claims found matching current active filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBonuses.map((b) => {
                      const isUnlocked = b.status === 'Unlocked';
                      const isProgress = b.status === 'In Progress';
                      const isExpired = b.status === 'Expired';

                      let badgeStyle = '';
                      if (isUnlocked) badgeStyle = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                      if (isProgress) badgeStyle = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                      if (isExpired) badgeStyle = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';

                      return (
                        <tr key={b.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-300">{b.id}</td>
                          <td className="py-3 px-4 font-bold text-white">@{b.username}</td>
                          <td className="py-3 px-4 text-slate-200 font-semibold">{b.schemeName}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-850 text-[9px] font-bold text-indigo-300 uppercase font-mono">
                              {b.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-black text-sm text-gold-500">
                            ${b.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-300">
                            <div className="flex flex-col items-end">
                              <span className="font-mono text-[11px] font-bold">
                                ${b.progress.toLocaleString()} / ${b.target.toLocaleString()}
                              </span>
                              <div className="w-20 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                <div 
                                  className={`h-full ${isUnlocked ? 'bg-emerald-400' : isExpired ? 'bg-rose-400' : 'bg-blue-400'}`}
                                  style={{ width: `${Math.min(100, (b.progress / b.target) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-extrabold ${badgeStyle}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-slate-500 font-mono text-[10px]">
                            {new Date(b.date).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
