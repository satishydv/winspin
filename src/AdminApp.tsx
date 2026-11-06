import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Coins, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  Tv, 
  ShieldAlert, 
  Settings, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Bell, 
  Search, 
  LogOut, 
  Activity, 
  Gift, 
  Calendar, 
  UserCheck, 
  UserPlus,
  AlertTriangle,
  Gauge,
  Radar,
  Network,
  Vault,
  Trophy,
  AreaChart,
  FileSpreadsheet,
  Image as ImageIcon
} from 'lucide-react';
import HeroBannerManagement from './admin-components/HeroBannerManagement';
import { 
  LiveBet, 
  Player, 
  FinancialRequest, 
  Agent, 
  AlertNotification,
  HeroBanner
} from './adminTypes';
import { 
  INITIAL_PLAYERS, 
  INITIAL_AGENTS, 
  INITIAL_PENDING_REQUESTS, 
  COMPLETED_TRANSACTION_HISTORY, 
  INITIAL_BETS, 
  SIMULATION_PLAYERS, 
  SIMULATION_GAMES, 
  SYSTEM_BONUS_SETTINGS,
  INITIAL_HERO_BANNERS
} from './adminData';

import KPICards from './admin-components/KPICards';
import LiveBetFeed from './admin-components/LiveBetFeed';
import PlayerManagement from './admin-components/PlayerManagement';
import FinanceManagement from './admin-components/FinanceManagement';
import RiskAnalysis from './admin-components/RiskAnalysis';
import BonusSettingsView from './admin-components/BonusSettingsView';
import DashboardPendingRequests from './admin-components/DashboardPendingRequests';
import RegisterView from './admin-components/RegisterView';
import LoveTokenChart from './admin-components/LoveTokenChart';
import GGRCategoryPieChart from './admin-components/GGRCategoryPieChart';
import HourlyBetVelocityChart from './admin-components/HourlyBetVelocityChart';
import ReportsView from './admin-components/ReportsView';
import LoginView from './admin-components/LoginView';

export default function App() {
  // Sidebar states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<string>('chandu');

  // Enforce dark mode as the single premium visual theme
  useEffect(() => {
    document.body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  }, []);

  // User Management Interactive Submenu controls
  const [userMenuOpen, setUserMenuOpen] = useState(false); 
  const [hierarchyOpen, setHierarchyOpen] = useState(false);
  const [superAgentsOpen, setSuperAgentsOpen] = useState(false);
  const [playerSubTab, setPlayerSubTab] = useState<'players' | 'agents' | 'ips'>('players');
  const [isAddingPlayerExternal, setIsAddingPlayerExternal] = useState(false);
  const [highlightBalanceTransfer, setHighlightBalanceTransfer] = useState(false);

  // Bonus System and Payment Config controls
  const [bonusMenuOpen, setBonusMenuOpen] = useState(false);
  const [paymentMenuOpen, setPaymentMenuOpen] = useState(false);
  const [bonusSubTab, setBonusSubTab] = useState<'overview' | 'schemes' | 'add-scheme' | 'enrollments' | 'claims'>('schemes');
  const [activeSubTabPayment, setActiveSubTabPayment] = useState<boolean>(false);

  // Reports Interactive controls
  const [reportsMenuOpen, setReportsMenuOpen] = useState(false);
  const [reportsSubTab, setReportsSubTab] = useState<'payment-reports' | 'ggr-reports' | 'bonus-reports'>('payment-reports');

  const closeAllMenus = () => {
    setUserMenuOpen(false);
    setHierarchyOpen(false);
    setSuperAgentsOpen(false);
    setBonusMenuOpen(false);
    setPaymentMenuOpen(false);
    setReportsMenuOpen(false);
  };

  const toggleMenu = (menu: 'user' | 'hierarchy' | 'superAgents' | 'bonus' | 'payment' | 'reports') => {
    setUserMenuOpen(prev => menu === 'user' ? !prev : false);
    setHierarchyOpen(prev => menu === 'hierarchy' ? !prev : false);
    setSuperAgentsOpen(prev => menu === 'superAgents' ? !prev : false);
    setBonusMenuOpen(prev => menu === 'bonus' ? !prev : false);
    setPaymentMenuOpen(prev => menu === 'payment' ? !prev : false);
    setReportsMenuOpen(prev => menu === 'reports' ? !prev : false);
  };

  // Core administrative states
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [pendingRequests, setPendingRequests] = useState<FinancialRequest[]>(INITIAL_PENDING_REQUESTS);
  const [completedHistory, setCompletedHistory] = useState<FinancialRequest[]>(COMPLETED_TRANSACTION_HISTORY);
  const [bets, setBets] = useState<LiveBet[]>(INITIAL_BETS);
  const [bonusRules, setBonusRules] = useState(SYSTEM_BONUS_SETTINGS);
  const [banners, setBanners] = useState<HeroBanner[]>(INITIAL_HERO_BANNERS);

  // Financial aggregates
  const [todayGgr, setTodayGgr] = useState(20000);
  const [monthGgrCasino, setMonthGgrCasino] = useState(100100);
  const [monthGgrSports, setMonthGgrSports] = useState(42000);
  const [totalGgr, setTotalGgr] = useState(380450);
  const [monthNgr, setMonthNgr] = useState(85900);
  const [monthDeposits, setMonthDeposits] = useState(145000);
  const [monthWithdrawals, setMonthWithdrawals] = useState(59120);

  // Live betting simulation toggle
  const [isSimulating, setIsSimulating] = useState(true);

  // Toast / security alert states
  const [alerts, setAlerts] = useState<AlertNotification[]>([
    {
      id: 'al-1',
      type: 'info',
      message: 'Casino Admin Suite booted. System metrics synchronized.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  // Simulated live bet generator loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick random simulated player (prevent banned)
      const allowedPlayers = players.filter(p => p.status !== 'banned');
      let username = SIMULATION_PLAYERS[Math.floor(Math.random() * SIMULATION_PLAYERS.length)];
      if (allowedPlayers.length > 0 && Math.random() > 0.3) {
        username = allowedPlayers[Math.floor(Math.random() * allowedPlayers.length)].username;
      }

      const game = SIMULATION_GAMES[Math.floor(Math.random() * SIMULATION_GAMES.length)];
      
      // Stakes and payouts logic
      const isHighRoller = Math.random() > 0.85;
      const stake = isHighRoller 
        ? Math.floor(Math.random() * 8500) + 1500 
        : Math.floor(Math.random() * 240) + 10;
        
      const randOutcome = Math.random();
      let multiplier = 0;
      let status: 'won' | 'lost' = 'lost';
      
      if (randOutcome > 0.55) {
        status = 'won';
        multiplier = randOutcome > 0.95 
          ? Number((Math.random() * 45 + 5).toFixed(2)) // Super Big reward
          : Number((Math.random() * 2.5 + 0.5).toFixed(2)); // Standard small win
      }

      const winAmount = multiplier > 0 ? Number((stake * multiplier).toFixed(2)) : 0;
      
      // Calculate resulting GGR (GGR = bet stake - win payout)
      const netGgr = stake - winAmount;

      const newBet: LiveBet = {
        id: `bet-sim-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        username,
        gameName: game.name,
        gameType: game.type,
        betAmount: stake,
        multiplier,
        winAmount,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status
      };

      // Push bet to live logs
      setBets(prev => [newBet, ...prev]);

      // Apply updates to platform metrics
      setTodayGgr(prev => prev + netGgr);
      setTotalGgr(prev => prev + netGgr);
      
      if (game.type === 'Sports') {
        setMonthGgrSports(prev => prev + netGgr);
      } else {
        setMonthGgrCasino(prev => prev + netGgr);
      }
      setMonthNgr(prev => prev + (netGgr * 0.88)); // NGR standard calculation post tax

      // Update the target player's total stats if they are loaded in our active client lists
      setPlayers(prevPlayers => {
        return prevPlayers.map(p => {
          if (p.username === username) {
            const tempBalance = multiplier > 0 
              ? p.balance + (winAmount - stake) 
              : p.balance - stake;
            
            return {
              ...p,
              balance: Math.max(0, Number(tempBalance.toFixed(2))),
              roundsPlayed: p.roundsPlayed + 1,
              totalBet: p.totalBet + stake,
              totalWin: p.totalWin + winAmount,
              ggr: p.ggr + netGgr
            };
          }
          return p;
        });
      });

      // Spot jackpot payouts over ₹5,000 to spawn security alerts
      if (winAmount >= 5000) {
        const superAlert: AlertNotification = {
          id: `al-${Date.now()}`,
          type: 'warn',
          message: `🚨 Jackpot alert: @${username} won $${winAmount.toLocaleString()} on ${game.name}!`,
          timestamp: new Date().toLocaleTimeString()
        };
        setAlerts(prev => [superAlert, ...prev]);
      }

    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, players]);

  // State trigger actions
  const handleToggleSimulation = () => {
    setIsSimulating(!isSimulating);
    const textState = !isSimulating ? 'Active' : 'Muted';
    addSystemAlert('info', `Real-time bet simulation is now ${textState}.`);
  };

  const handleClearBets = () => {
    setBets([]);
    addSystemAlert('info', 'Live bet monitor feed cleared.');
  };

  const handleAddCustomBet = (newBet: LiveBet) => {
    setBets(prev => [newBet, ...prev]);
    const netGgr = newBet.betAmount - newBet.winAmount;
    setTodayGgr(prev => prev + netGgr);
    setTotalGgr(prev => prev + netGgr);
    if (newBet.gameType === 'Sports') {
      setMonthGgrSports(prev => prev + netGgr);
    } else {
      setMonthGgrCasino(prev => prev + netGgr);
    }

    addSystemAlert('success', `Manual simulation block loaded: @${newBet.username} wagered $${newBet.betAmount}.`);
  };

  // User management updates
  const handleUpdatePlayerStatus = (playerId: string, newStatus: 'online' | 'offline' | 'banned') => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, status: newStatus };
      }
      return p;
    }));

    const user = players.find(p => p.id === playerId);
    if (user) {
      if (newStatus === 'banned') {
        addSystemAlert('danger', `User Account BANNED: @${user.username} has been denied auth permissions.`);
      } else {
        addSystemAlert('success', `User Account Re-instated: @${user.username} restored.`);
      }
    }
  };

  const handleAdjustPlayerBalance = (playerId: string, adjustmentAmount: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        const nextBal = Math.max(0, p.balance + adjustmentAmount);
        return { 
          ...p, 
          balance: nextBal,
          depositsTotal: adjustmentAmount > 0 ? p.depositsTotal + adjustmentAmount : p.depositsTotal
        };
      }
      return p;
    }));

    const user = players.find(p => p.id === playerId);
    if (user) {
      const typeStr = adjustmentAmount > 0 ? 'credited' : 'deducted';
      addSystemAlert('success', `Balance update: $${Math.abs(adjustmentAmount)} has been ${typeStr} from @${user.username}.`);
    }
  };

  const handleRegisterPlayer = (newPlayer: Player) => {
    setPlayers(prev => [newPlayer, ...prev]);
    addSystemAlert('success', `Account generated: Registered user @${newPlayer.username} from ${newPlayer.country}.`);
  };

  const handleAddAgent = (newAgent: Agent) => {
    setAgents(prev => [newAgent, ...prev]);
    addSystemAlert('success', `Affiliate Whitelisted: Appointed Agent @${newAgent.username} as premium tier referrer.`);
  };

  // Financial Queue approvals
  const handleApproveRequest = (requestId: string) => {
    const claim = pendingRequests.find(r => r.id === requestId);
    if (!claim) return;

    // Apply currency adjustments
    setPlayers(prev => prev.map(p => {
      if (p.username === claim.username) {
        if (claim.type === 'deposit') {
          return {
            ...p,
            balance: p.balance + claim.amount,
            depositsTotal: p.depositsTotal + claim.amount
          };
        } else {
          // Withdrawal settles
          return {
            ...p,
            balance: Math.max(0, p.balance - claim.amount),
            withdrawalsTotal: p.withdrawalsTotal + claim.amount
          };
        }
      }
      return p;
    }));

    // Update statistics
    if (claim.type === 'deposit') {
      setMonthDeposits(prev => prev + claim.amount);
    } else {
      setMonthWithdrawals(prev => prev + claim.amount);
    }

    // Move to history
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    
    const approvedRequest: FinancialRequest = {
      ...claim,
      status: 'approved',
      requestedAt: new Date().toISOString()
    };
    
    setCompletedHistory(prev => [approvedRequest, ...prev]);
    addSystemAlert('success', `Authorized Claim ${requestId}: $${claim.amount} ${claim.type} for @${claim.username} approved.`);
  };

  const handleRejectRequest = (requestId: string) => {
    const claim = pendingRequests.find(r => r.id === requestId);
    if (!claim) return;

    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    
    const rejectedRequest: FinancialRequest = {
      ...claim,
      status: 'rejected',
      requestedAt: new Date().toISOString()
    };

    setCompletedHistory(prev => [rejectedRequest, ...prev]);
    addSystemAlert('warn', `Rejected Claim ${requestId}: Cancelled pending ${claim.type} request for @${claim.username}.`);
  };

  const handleInstantDeposit = (username: string, amount: number, method: string) => {
    setPlayers(prev => prev.map(p => {
      if (p.username === username) {
        return {
          ...p,
          balance: p.balance + amount,
          depositsTotal: p.depositsTotal + amount
        };
      }
      return p;
    }));

    setMonthDeposits(prev => prev + amount);

    const depositTx: FinancialRequest = {
      id: `man-dp-${Date.now().toString().slice(-4)}`,
      username,
      amount,
      type: 'deposit',
      status: 'approved',
      paymentMethod: method,
      requestedAt: new Date().toISOString()
    };

    setCompletedHistory(prev => [depositTx, ...prev]);
    addSystemAlert('success', `Instant Manual credit of ₹${amount} injected for @${username}.`);
  };

  // Generic helpers
  const addSystemAlert = (type: AlertNotification['type'], message: string) => {
    const newAlert: AlertNotification = {
      id: `al-${Date.now()}`,
      type,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setAlerts(prev => [newAlert, ...prev.slice(0, 15)]);
  };

  const handleSaveBonusRules = (updatedRules: typeof SYSTEM_BONUS_SETTINGS) => {
    setBonusRules(updatedRules);
    addSystemAlert('info', 'Promotion rule equations revised in the smart controller.');
  };

  // Nav categories from mockup images
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: Gauge },
    { id: 'live-market', label: 'Live Bets Monitor', icon: Radar },
    { id: 'users', label: 'Clients & Agents', icon: Network },
    { id: 'finance', label: 'Banking & Vault', icon: Vault },
    { id: 'bonus-system', label: 'Bonus Settings', icon: Trophy },
    { id: 'pnl-analytics', label: 'P&L Reports', icon: AreaChart },
    { id: 'reports', label: 'Custom Reports', icon: FileSpreadsheet }
  ];

  if (!isLoggedIn) {
    return (
      <LoginView 
        onLoginSuccess={(username) => {
          setIsLoggedIn(true);
          setAdminUser(username);
          addSystemAlert('success', `Security session whitelisted for administrator @${username}.`);
        }} 
      />
    );
  }

  return (
    <div className="h-screen bg-obsidian-950 text-slate-100 font-sans flex flex-col relative overflow-hidden cyber-grid">
      
      {/* GLOWING AMBIENT GRADIENTS (Non-Intrusive, Highly aesthetic, "Casino Horizon" feeling) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-orange-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-t from-emerald-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER SECTION (Mockups 1 & 2 design metrics) */}
      <header className="sticky top-0 z-30 bg-obsidian-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile sidebar trigger */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 px-2 rounded bg-obsidian-950 hover:bg-slate-800 border border-slate-800/80 text-slate-300 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-gold-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/20 font-bold font-display text-slate-950 text-base">
              Ω
            </div>
            <div>
              <h1 className="text-base font-black font-display tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#B38728] via-[#FBF5B7] to-[#AA771C] uppercase leading-none drop-shadow-sm">
                VARA567
              </h1>
              <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] leading-none uppercase block mt-1.5 font-bold">
                Gaming Command Suite
              </span>
            </div>
          </div>
        </div>

        {/* Global center banner clock & stats */}
        <div className="hidden md:flex items-center gap-6 text-xs bg-obsidian-950/80 border border-slate-850 px-4 py-1.5 rounded-full select-none">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="h-3.5 w-3.5 text-gold-500" />
            <span className="font-sans">Timezone: <b>GMT +5:30</b></span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-neon animate-pulse" />
            <span className="text-slate-300 font-semibold font-mono">Live Feeds Whitelisted</span>
          </div>
        </div>

        {/* Right side Profile & Alerts */}
        <div className="flex items-center gap-3.5">
          {/* Security alerts ticker */}
          <div className="relative group cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-obsidian-950 hover:bg-slate-850 flex items-center justify-center border border-slate-850 transition-colors">
              <Bell className="h-4 w-4 text-slate-300 group-hover:scale-110 transition-transform" />
              {alerts.length > 0 && (
                <span className="absolute top-[-2px] right-[-2px] h-2 w-2 bg-rose-neon rounded-full" />
              )}
            </div>

            {/* Micro Alerts dropdown view */}
            <div className="absolute right-0 mt-2 w-72 bg-gradient-to-b from-obsidian-900 to-obsidian-950 border border-slate-800 rounded-xl p-3 shadow-2xl space-y-2.5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-50">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block">Security Auditing logs</span>
              <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-slate-850/60 scrollbar-none">
                {alerts.map((al) => (
                  <div key={al.id} className="pt-2 text-[10px] font-sans text-slate-300 flex justify-between gap-1.5">
                    <span className="max-w-[200px] truncate">{al.message}</span>
                    <span className="text-slate-500 text-[9px] font-mono shrink-0">{al.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* User profile section matching chandu logged in */}
          <div className="relative">
            <button 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 bg-obsidian-950 hover:bg-slate-800 border border-slate-850 py-1 px-3 rounded-lg text-xs font-sans transition-all text-left outline-none shrink-0"
            >
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Logged in as</p>
                <p className="font-semibold text-gold-400 font-display">{adminUser}</p>
              </div>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-56 bg-obsidian-900 border border-slate-800 rounded-xl p-3.5 shadow-2xl z-50 space-y-3 animate-fadeIn">
                <div className="border-b border-slate-850 pb-2">
                  <p className="text-slate-400 text-[10px]">Associated Admin Email</p>
                  <p className="text-xs font-bold font-sans text-white truncate">thesatishydv@gmail.com</p>
                </div>
                <div className="space-y-1 bg-obsidian-950 p-2 rounded border border-slate-850 text-[10px] text-slate-400">
                  <p>Authority: <b>Ultimate Root</b></p>
                  <p>Sessions expiring: 19:30 UTC</p>
                </div>
                <button 
                  onClick={() => {
                    setIsLoggedIn(false);
                    setUserDropdownOpen(false);
                    addSystemAlert('info', `Administrative session for @${adminUser} closed securely.`);
                  }}
                  className="w-full py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-[#3f1c1c] hover:from-rose-500 hover:to-[#572222] border border-rose-500/30 text-white text-xs font-bold shadow-md shadow-rose-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out Securely
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE SPLIT FRAME */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        
        {/* SIDEBAR NAVIGATION FRAME (Mockup side categories styled with top aesthetic) */}
        <aside className={`
          fixed lg:sticky top-[61px] lg:top-0 left-0 h-[calc(100vh-61px)] lg:h-full w-64 bg-obsidian-900 border-r border-slate-800/80 z-40 transition-transform duration-300 flex flex-col justify-between p-4 shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="space-y-6 flex-1 overflow-y-auto">
            {/* Category: MAIN */}
            <div>
              <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase block mb-3 font-sans">
                MAIN SERVICES
              </span>
              <ul className="space-y-1.5">
                {navigationItems.slice(0, 2).map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                        closeAllMenus();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold font-display transition-all border outline-none ${
                        activeTab === item.id 
                          ? 'sidebar-active-gradient text-white border-[#4E5DFD]/35' 
                          : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.id === 'live-market' && isSimulating && (
                        <span className="flex h-2 w-2 relative shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-neon opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-neon" />
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category: USER MANAGEMENT */}
            <div>
              <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase block mb-3 font-sans">
                USER MANAGEMENT
              </span>
              <ul className="space-y-1.5 font-sans">
                {/* 1. Clients Collapsible Menu */}
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('users');
                      toggleMenu('user');
                      setPlayerSubTab('players');
                      setIsAddingPlayerExternal(false);
                      setHighlightBalanceTransfer(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold font-display transition-all border outline-none ${
                      activeTab === 'users' && playerSubTab === 'players'
                        ? 'sidebar-active-gradient text-white border-[#4E5DFD]/35'
                        : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Network className="h-4 w-4 shrink-0" />
                      <span>Clients</span>
                    </div>
                    {userMenuOpen ? <ChevronDown className="h-3 w-3 text-slate-400" /> : <ChevronRight className="h-3 w-3 text-slate-400" />}
                  </button>

                  {/* Submenus under Clients */}
                  {userMenuOpen && (
                    <ul className="pl-6 pt-1.5 pb-1 space-y-1 border-l border-slate-800 ml-4 animate-fadeIn">
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('users');
                            setPlayerSubTab('players');
                            setIsAddingPlayerExternal(false);
                            setHighlightBalanceTransfer(false);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'users' && playerSubTab === 'players' && !isAddingPlayerExternal && !highlightBalanceTransfer
                              ? 'text-white font-bold bg-slate-800/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Client Listing
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('users');
                            setPlayerSubTab('players');
                            setIsAddingPlayerExternal(true);
                            setHighlightBalanceTransfer(false);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'users' && playerSubTab === 'players' && isAddingPlayerExternal
                              ? 'text-white font-bold bg-slate-800/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Add New User
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('users');
                            setPlayerSubTab('players');
                            setIsAddingPlayerExternal(false);
                            setHighlightBalanceTransfer(true);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'users' && playerSubTab === 'players' && highlightBalanceTransfer
                              ? 'text-[#5C6BFF] font-bold bg-slate-800/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Balance Transfer
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('users');
                            setPlayerSubTab('agents');
                            setIsAddingPlayerExternal(false);
                            setHighlightBalanceTransfer(false);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'users' && playerSubTab === 'agents'
                              ? 'text-white font-bold bg-slate-800/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Admin Users
                        </button>
                      </li>
                    </ul>
                  )}
                </li>

                {/* 2. Hierarchy collapsible menu */}
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('users');
                      setPlayerSubTab('agents');
                      toggleMenu('hierarchy');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold font-display transition-all border outline-none ${
                      activeTab === 'users' && playerSubTab === 'agents' && !userMenuOpen
                        ? 'bg-gradient-to-r from-[#4E5DFD] to-[#1C1A42] text-white border-[#4E5DFD]/30 shadow-md shadow-indigo-950/20'
                        : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="h-4 w-4 shrink-0 text-amber-500" />
                      <span>Hierarchy</span>
                    </div>
                    {hierarchyOpen ? <ChevronDown className="h-3 w-3 text-slate-400" /> : <ChevronRight className="h-3 w-3 text-slate-400" />}
                  </button>
                  {hierarchyOpen && (
                    <ul className="pl-6 pt-1.5 pb-1 space-y-1 border-l border-slate-800 ml-4 animate-fadeIn">
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('users');
                            setPlayerSubTab('agents');
                            setSidebarOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans text-slate-400 hover:text-white"
                        >
                          Agent Net Tree
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('users');
                            setPlayerSubTab('agents');
                            setSidebarOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans text-slate-400 hover:text-white"
                        >
                          Commission Matrix
                        </button>
                      </li>
                    </ul>
                  )}
                </li>

                {/* 3. Super Agents collapsible menu */}
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('users');
                      setPlayerSubTab('agents');
                      toggleMenu('superAgents');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold font-display transition-all bg-transparent text-slate-300 border-transparent hover:bg-slate-800/60 hover:text-white outline-none border border-transparent"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Super Agents</span>
                    </div>
                    {superAgentsOpen ? <ChevronDown className="h-3 w-3 text-slate-400" /> : <ChevronRight className="h-3 w-3 text-slate-400" />}
                  </button>
                  {superAgentsOpen && (
                    <ul className="pl-6 pt-1.5 pb-1 space-y-1 border-l border-slate-800 ml-4 animate-fadeIn">
                      <li>
                        <div className="px-3 py-1 text-[10px] text-slate-500 italic">
                          Active Super Masters ({agents.length})
                        </div>
                      </li>
                      {agents.map(agent => (
                        <li key={agent.id}>
                          <button
                            onClick={() => {
                              setActiveTab('users');
                              setPlayerSubTab('agents');
                              setSidebarOpen(false);
                            }}
                            className="w-full text-left px-3 py-1 rounded-md text-[10px] text-slate-400 hover:text-white truncate"
                          >
                            @{agent.username} ({agent.commissionRate}% rate)
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Interactive Signup / Registration Page */}
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('register-page');
                      setSidebarOpen(false);
                      closeAllMenus();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold font-display transition-all border outline-none ${
                      activeTab === 'register-page'
                        ? 'sidebar-active-gradient text-white border-[#4E5DFD]/35'
                        : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <UserPlus className="h-4 w-4 shrink-0 text-[#5C6BFF]" />
                      <span>Registration Wizard</span>
                    </div>
                    <span className="px-1.5 py-0.2 text-[9px] bg-[#4E5DFD]/20 text-[#5C6BFF] font-extrabold rounded-md uppercase tracking-wider scale-95 border border-[#4E5DFD]/20">
                      OTP
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Category: FINANCE */}
            <div>
              <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase block mb-3 font-sans">
                TRANSACTION GATEWAY
              </span>
              <ul className="space-y-1.5 font-sans">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('finance');
                      setSidebarOpen(false);
                      closeAllMenus();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold font-display transition-all border outline-none ${
                      activeTab === 'finance' 
                        ? 'sidebar-active-gradient text-white border-[#4E5DFD]/35' 
                        : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Vault className="h-4 w-4 shrink-0 text-gold-500" />
                      <span>Banking & Vault</span>
                    </div>
                    {pendingRequests.length > 0 && (
                      <span className="px-1.5 py-0.2 text-[9px] bg-rose-600 text-white font-bold rounded-full animate-pulse">
                        {pendingRequests.length}
                      </span>
                    )}
                  </button>
                </li>
              </ul>
            </div>

            {/* Category: BONUS MANAGEMENT */}
            <div>
              <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase block mb-3 font-sans">
                REWARDS & PROMOTIONS
              </span>
              <ul className="space-y-1.5 font-sans">
                {/* Collapsible BONUS SYSTEM menu */}
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('bonus-system');
                      toggleMenu('bonus');
                      setActiveSubTabPayment(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold font-display transition-all border outline-none ${
                      activeTab === 'bonus-system' && !activeSubTabPayment
                        ? 'sidebar-active-gradient text-white border-[#4E5DFD]/35'
                        : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="h-4 w-4 shrink-0 text-amber-500" />
                      <span>Bonus System</span>
                    </div>
                    {bonusMenuOpen ? <ChevronDown className="h-3 w-3 text-slate-400" /> : <ChevronRight className="h-3 w-3 text-slate-400" />}
                  </button>

                  {bonusMenuOpen && (
                    <ul className="pl-6 pt-1.5 pb-1 space-y-1 border-l border-slate-800 ml-4 animate-fadeIn">
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('bonus-system');
                            setBonusSubTab('overview');
                            setActiveSubTabPayment(false);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'bonus-system' && bonusSubTab === 'overview' && !activeSubTabPayment
                              ? 'text-white font-bold bg-slate-800/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Overview
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('bonus-system');
                            setBonusSubTab('schemes');
                            setActiveSubTabPayment(false);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'bonus-system' && bonusSubTab === 'schemes' && !activeSubTabPayment
                              ? 'text-white font-bold bg-slate-800/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Schemes
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('bonus-system');
                            setBonusSubTab('add-scheme');
                            setActiveSubTabPayment(false);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'bonus-system' && bonusSubTab === 'add-scheme' && !activeSubTabPayment
                              ? 'text-white font-bold bg-slate-800/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Add Scheme
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('bonus-system');
                            setBonusSubTab('enrollments');
                            setActiveSubTabPayment(false);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'bonus-system' && bonusSubTab === 'enrollments' && !activeSubTabPayment
                              ? 'text-white font-bold bg-slate-800/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Enrollments
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('bonus-system');
                            setBonusSubTab('claims');
                            setActiveSubTabPayment(false);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'bonus-system' && bonusSubTab === 'claims' && !activeSubTabPayment
                              ? 'text-white font-bold bg-slate-800/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Claims History
                        </button>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Collapsible PAYMENT CONFIG menu */}
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('bonus-system');
                      toggleMenu('payment');
                      setActiveSubTabPayment(true);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold font-display transition-all border outline-none ${
                      activeTab === 'bonus-system' && activeSubTabPayment
                        ? 'sidebar-active-gradient text-white border-[#4E5DFD]/35'
                        : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Settings className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Payment Config</span>
                    </div>
                    {paymentMenuOpen ? <ChevronDown className="h-3 w-3 text-slate-400" /> : <ChevronRight className="h-3 w-3 text-slate-400" />}
                  </button>

                  {paymentMenuOpen && (
                    <ul className="pl-6 pt-1.5 pb-1 space-y-1 border-l border-slate-800 ml-4 animate-fadeIn">
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('bonus-system');
                            setActiveSubTabPayment(true);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'bonus-system' && activeSubTabPayment
                              ? 'text-white font-bold bg-slate-800/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Gateway Limits & Commissions
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>

            {/* Category: REPORTS / ANALYTICS */}
            <div>
              <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase block mb-3 font-sans">
                REVENUE INTELLIGENCE
              </span>
              <ul className="space-y-1.5">
                {navigationItems.slice(5, 6).map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                        closeAllMenus();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold font-display transition-all border outline-none ${
                        activeTab === item.id 
                          ? 'sidebar-active-gradient text-white border-[#4E5DFD]/35' 
                          : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  </li>
                ))}

                {/* Collapsible REPORTS menu */}
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('reports');
                      toggleMenu('reports');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold font-display transition-all border outline-none ${
                      activeTab === 'reports'
                        ? 'sidebar-active-gradient text-white border-[#4E5DFD]/35'
                        : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="h-4 w-4 shrink-0 text-indigo-400" />
                      <span>Reports Submenu</span>
                    </div>
                    {reportsMenuOpen ? <ChevronDown className="h-3 w-3 text-slate-400" /> : <ChevronRight className="h-3 w-3 text-slate-400" />}
                  </button>

                  {reportsMenuOpen && (
                    <ul className="pl-6 pt-1.5 pb-1 space-y-1 border-l border-slate-850 ml-4 animate-fadeIn">
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('reports');
                            setReportsSubTab('payment-reports');
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'reports' && reportsSubTab === 'payment-reports'
                              ? 'text-white font-bold bg-slate-800/40 border-l-2 border-indigo-400 pl-2'
                              : 'text-slate-400 hover:text-white pl-3'
                          }`}
                        >
                          Payment Reports
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('reports');
                            setReportsSubTab('ggr-reports');
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'reports' && reportsSubTab === 'ggr-reports'
                              ? 'text-white font-bold bg-slate-800/40 border-l-2 border-indigo-400 pl-2'
                              : 'text-slate-400 hover:text-white pl-3'
                          }`}
                        >
                          GGR Reports
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab('reports');
                            setReportsSubTab('bonus-reports');
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-sans transition-all outline-none ${
                            activeTab === 'reports' && reportsSubTab === 'bonus-reports'
                              ? 'text-white font-bold bg-slate-800/40 border-l-2 border-indigo-400 pl-2'
                              : 'text-slate-400 hover:text-white pl-3'
                          }`}
                        >
                          Bonus Reports
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>

            {/* Category: PORTAL CUSTOMIZATION */}
            <div>
              <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase block mb-3 font-sans">
                PORTAL CUSTOMIZATION
              </span>
              <ul className="space-y-1.5 font-sans">
                <li>
                  <button
                    id="btn-nav-hero-banners"
                    onClick={() => {
                      setActiveTab('hero-banners');
                      setSidebarOpen(false);
                      closeAllMenus();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold font-display transition-all border outline-none ${
                      activeTab === 'hero-banners' 
                        ? 'sidebar-active-gradient text-white border-[#4E5DFD]/35 font-bold shadow-md shadow-indigo-950/20' 
                        : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ImageIcon className="h-4 w-4 shrink-0 text-[#5C6BFF]" />
                      <span>Hero Banners</span>
                    </div>
                    <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold rounded-md uppercase tracking-wider scale-95 border border-emerald-500/20">
                      Live
                    </span>
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </aside>

        {/* Dynamic Sidebar backdrop for mobile view */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-[61px] bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}

        {/* CORE INTERFACE WORKSPACE FRAME */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto overflow-x-hidden">
          
          {/* Dashboard route workspace view */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Dynamic Welcome Heading */}
              <div className="p-5 bg-gradient-to-r from-obsidian-900 to-obsidian-950 border border-slate-800/80 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-display text-white tracking-tight">
                    Platform Revenue & Telemetry Center
                  </h2>
                  <p className="text-slate-400 text-xs font-sans max-w-xl">
                    Welcome to VARA567 casino admin portal panel. Here is your unified visualizer tracking client wagers, withdrawal settlements, and sports outcomes.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleToggleSimulation()}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold font-sans tracking-wide transition-all shadow-md active:scale-[0.98] ${
                      isSimulating 
                        ? 'bg-gradient-to-r from-rose-600 to-[#3f1c1c] text-white hover:from-rose-500 hover:to-[#572222] border border-rose-500/30 shadow-rose-950/20'
                        : 'bg-gradient-to-r from-[#4E5DFD] to-[#1C1A42] text-white hover:from-[#5C6BFF] hover:to-[#242152] border border-[#4E5DFD]/30 shadow-indigo-950/20'
                    }`}
                  >
                    {isSimulating ? 'Pause Telemetry' : 'Play Telemetry'}
                  </button>
                  
                  <button 
                    onClick={() => {
                      setTodayGgr(20000);
                      addSystemAlert('info', 'Platform daily profit metrics reset.');
                    }}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold font-sans tracking-wide bg-gradient-to-r from-[#4E5DFD] to-[#1C1A42] text-white hover:from-[#5C6BFF] hover:to-[#242152] border border-[#4E5DFD]/30 shadow-md shadow-indigo-950/20 active:scale-[0.98] transition-all"
                  >
                    Reset Daily Metrics
                  </button>
                </div>
              </div>

              {/* Robust KPI Cards sub-component */}
              <KPICards
                players={players}
                pendingRequests={pendingRequests}
                todayGgr={todayGgr}
                monthGgrCasino={monthGgrCasino}
                monthGgrSports={monthGgrSports}
                totalGgr={totalGgr}
                monthNgr={monthNgr}
                monthDeposits={monthDeposits}
                monthWithdrawals={monthWithdrawals}
                onFilterChange={(tab) => setActiveTab(tab)}
              />

              {/* Mini split grids: Today's GGR reports, and simple quick alerts */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* 7-Day Performance Charts panel */}
                <div className="xl:col-span-2">
                  <RiskAnalysis 
                    players={players}
                    onRefreshTelemetry={() => {
                      addSystemAlert('info', 'Active platform metrics forced sync.');
                    }}
                  />
                </div>

                {/* Right side analytics column stacked vertically in the same row */}
                <div className="flex flex-col gap-6">
                  {/* $LOVE Utility Token Interactive Performance Chart */}
                  <LoveTokenChart />
                  
                  {/* Interactive GGR Category Splits Pie/Doughnut Chart */}
                  <GGRCategoryPieChart />
                  
                  {/* Interactive Hourly Bet count Velocity Chart */}
                  <HourlyBetVelocityChart />
                </div>

              </div>

              {/* Actionable Deposit/Withdraw Queue Section */}
              <DashboardPendingRequests 
                pendingRequests={pendingRequests}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
                onNavigateToFinance={() => setActiveTab('finance')}
              />

            </div>
          )}

          {/* Live Bets Monitor tab */}
          {activeTab === 'live-market' && (
            <div className="space-y-6 animate-fadeIn">
              <LiveBetFeed 
                bets={bets}
                isSimulating={isSimulating}
                onToggleSimulation={handleToggleSimulation}
                onClearBets={handleClearBets}
                onAddCustomBet={handleAddCustomBet}
              />
            </div>
          )}

          {/* Clients & Agents registration registry directory */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fadeIn">
              <PlayerManagement 
                players={players}
                agents={agents}
                onUpdatePlayerStatus={handleUpdatePlayerStatus}
                onAdjustPlayerBalance={handleAdjustPlayerBalance}
                onAddPlayer={handleRegisterPlayer}
                onAddAgent={handleAddAgent}
                activeSubTab={playerSubTab}
                isAddingPlayerOverride={isAddingPlayerExternal}
                highlightBalanceTransfer={highlightBalanceTransfer}
              />
            </div>
          )}

          {/* Financial requests deposit & withdrawal checkout logs */}
          {activeTab === 'finance' && (
            <div className="space-y-6 animate-fadeIn">
              <FinanceManagement 
                pendingRequests={pendingRequests}
                completedHistory={completedHistory}
                players={players}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
                onInstantDeposit={handleInstantDeposit}
              />
            </div>
          )}

          {/* Bonus configurations controls */}
          {activeTab === 'bonus-system' && (
            <div className="space-y-6 animate-fadeIn">
              <BonusSettingsView 
                onSaveBonusRules={handleSaveBonusRules}
                activeSubTab={activeSubTabPayment ? 'payment-config' : bonusSubTab}
                onSubTabChange={(tab) => {
                  if (tab === 'payment-config') {
                    setActiveSubTabPayment(true);
                  } else {
                    setActiveSubTabPayment(false);
                    setBonusSubTab(tab);
                  }
                }}
              />
            </div>
          )}

          {/* P&L Financial analytics reports */}
          {activeTab === 'pnl-analytics' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 bg-obsidian-900 border border-slate-800/80 rounded-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold font-display text-white uppercase tracking-wider">
                    Past Profitability & Yield Audits
                  </h2>
                  <p className="text-slate-400 text-xs font-sans">
                    View daily rolling bets, GGR, and net payouts post commission margins. Export analytical records for external accounting purposes.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      alert('Generating dynamic PDF statements... Complete document ready for print.');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#4E5DFD] to-[#1C1A42] hover:from-[#5C6BFF] hover:to-[#242152] border border-[#4E5DFD]/30 text-white font-bold text-xs rounded-xl tracking-wider shadow-md shadow-indigo-950/20 active:scale-[0.98] transition-all"
                  >
                    Compile PDF statement
                  </button>
                </div>
              </div>

              <RiskAnalysis 
                players={players}
                completedHistory={completedHistory}
                onRefreshTelemetry={() => {
                  addSystemAlert('info', 'Active platform metrics forced sync.');
                }}
              />
            </div>
          )}

          {/* Custom Reports section */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fadeIn">
              <ReportsView 
                pendingRequests={pendingRequests}
                completedHistory={completedHistory}
                players={players}
                agents={agents}
                bets={bets}
                activeSubTab={reportsSubTab}
                onSubTabChange={(tab) => setReportsSubTab(tab)}
              />
            </div>
          )}

          {/* New Interactive Register Page */}
          {activeTab === 'register-page' && (
            <RegisterView 
              agents={agents}
              onAddPlayer={handleRegisterPlayer}
              onViewClientList={() => {
                setActiveTab('users');
                setPlayerSubTab('players');
                setIsAddingPlayerExternal(false);
              }}
              addSystemAlert={addSystemAlert}
            />
          )}

          {/* Portal Slider Hero Editor view */}
          {activeTab === 'hero-banners' && (
            <div className="space-y-6 animate-fadeIn">
              <HeroBannerManagement 
                banners={banners}
                onUpdateBanners={(updatedBanners) => setBanners(updatedBanners)}
                triggerNotify={(type, message) => addSystemAlert(type, message)}
              />
            </div>
          )}

        </main>
      </div>

      {/* FLOATING QUICK STATS BAR FOOTER (Mockups 1 & 2 layout alignment) */}
      <footer className="bg-obsidian-900 border-t border-slate-800/80 px-4 py-3 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-sans">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-neon animate-pulse" />
            <span>Today GGR: <b className="text-white">₹{todayGgr.toLocaleString()}</b></span>
          </div>
          <div className="h-3 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gold-450 fill-amber-500" />
            <span>Weekly Deposits: <b className="text-white">₹{monthDeposits.toLocaleString()}</b></span>
          </div>
          <div className="h-3 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-1.5 font-mono">
            <span>Rounds tracked: <b className="text-white">{players.reduce((acc, curr) => acc + curr.roundsPlayed, 0).toLocaleString()}</b></span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-sans tracking-tight">
          Telemetry stream powered by <b>VARA567 administrative intelligence Node</b> &copy; 2026. All rights whitelisted.
        </div>
      </footer>

    </div>
  );
}
