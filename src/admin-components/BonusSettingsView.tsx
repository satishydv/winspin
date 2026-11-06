import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Settings, 
  Coins, 
  HelpCircle, 
  CheckCircle, 
  ShieldAlert, 
  Trash2, 
  Check, 
  AlertTriangle, 
  PlusCircle, 
  Search, 
  Eye, 
  Filter, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  Pocket, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { SYSTEM_BONUS_SETTINGS } from '../adminData';
import IOSConfirmationModal from './IOSConfirmationModal';

interface BonusSettingsViewProps {
  onSaveBonusRules: (updatedRules: typeof SYSTEM_BONUS_SETTINGS) => void;
  activeSubTab?: 'overview' | 'schemes' | 'add-scheme' | 'enrollments' | 'claims' | 'payment-config';
  onSubTabChange?: (tab: 'overview' | 'schemes' | 'add-scheme' | 'enrollments' | 'claims' | 'payment-config') => void;
}

interface BonusScheme {
  id: string;
  name: string;
  type: string; 
  typeLabel: string; 
  description: string;
  enrolled: number;
  claims: number;
  paidOut: number; // in ₹
  isActive: boolean;
}

interface Enrollment {
  id: string;
  username: string;
  schemeName: string;
  bonusAmount: number;
  wageredProgress: number;
  wageredTarget: number;
  status: 'In Progress' | 'Unlocked' | 'Expired';
  dateEnrolled: string;
}

interface Claim {
  id: string;
  username: string;
  schemeName: string;
  paidOut: number;
  metricMet: string;
  timestamp: string;
  status: string;
}

// Initial mockup data corresponding exact match with user provided image
const INITIAL_SCHEMES: BonusScheme[] = [
  {
    id: 'scheme_1',
    name: 'Register & Get Free Bonus',
    type: 'WELCOME',
    typeLabel: 'WELCOME',
    description: 'Get ₹567 free on registration. 10X rolling mandatory.',
    enrolled: 13,
    claims: 3,
    paidOut: 1701,
    isActive: true
  },
  {
    id: 'scheme_2',
    name: '1st Deposit 100% Bonus',
    type: 'FIRST_DEP',
    typeLabel: 'FIRST DEPOSIT',
    description: '100% bonus on your first deposit, up to ₹5,000. 5X rolling.',
    enrolled: 6,
    claims: 5,
    paidOut: 100,
    isActive: true
  },
  {
    id: 'scheme_3',
    name: 'Daily Deposit Bonus',
    type: 'DAILY_DEP',
    typeLabel: 'DAILY DEPOSIT',
    description: '10% cash bonus on every daily deposit. 5X rolling.',
    enrolled: 7,
    claims: 1,
    paidOut: 100,
    isActive: true
  },
  {
    id: 'scheme_4',
    name: '10% Bonus on Losses Above ₹50,000',
    type: 'LOSS_ABOVE',
    typeLabel: 'LOSS ABOVE',
    description: '10% daily bonus on losses exceeding ₹50,000. 5X rolling.',
    enrolled: 5,
    claims: 0,
    paidOut: 0,
    isActive: true
  },
  {
    id: 'scheme_5',
    name: '5% Bonus on Losses Below ₹50,000',
    type: 'LOSS_BELOW',
    typeLabel: 'LOSS BELOW',
    description: '5% daily bonus on losses up to ₹50,000. 5X rolling.',
    enrolled: 7,
    claims: 4,
    paidOut: 103,
    isActive: true
  }
];

const INITIAL_ENROLLMENTS: Enrollment[] = [
  { id: 'enr1', username: 'gowtham', schemeName: 'Daily Deposit Bonus', bonusAmount: 72.00, wageredProgress: 180, wageredTarget: 360, status: 'In Progress', dateEnrolled: '2026-06-20' },
  { id: 'enr2', username: 'lucky_spin', schemeName: 'Register & Get Free Bonus', bonusAmount: 567.00, wageredProgress: 5670, wageredTarget: 5670, status: 'Unlocked', dateEnrolled: '2026-06-19' },
  { id: 'enr3', username: 'highroller_amit', schemeName: '10% Bonus on Losses Above ₹50,000', bonusAmount: 5000.00, wageredProgress: 15000, wageredTarget: 25000, status: 'In Progress', dateEnrolled: '2026-06-21' },
  { id: 'enr4', username: 'rahul_bhai', schemeName: '5% Bonus on Losses Below ₹50,000', bonusAmount: 250.00, wageredProgress: 1250, wageredTarget: 1250, status: 'Unlocked', dateEnrolled: '2026-06-18' },
  { id: 'enr5', username: 'kabir_sharma', schemeName: '1st Deposit 100% Bonus', bonusAmount: 1200.00, wageredProgress: 800, wageredTarget: 6000, status: 'In Progress', dateEnrolled: '2026-06-22' }
];

const INITIAL_CLAIMS: Claim[] = [
  { id: 'cl1', username: 'gowtham', schemeName: '1st Deposit 100% Bonus', paidOut: 100, metricMet: '5X Rollover Complete', timestamp: '2026-06-21 14:32', status: 'Approved & Liquidated' },
  { id: 'cl2', username: 'lucky_spin', schemeName: 'Register & Get Free Bonus', paidOut: 567, metricMet: '10X Rollover Complete', timestamp: '2026-06-20 18:15', status: 'Approved & Liquidated' },
  { id: 'cl3', username: 'rahul_bhai', schemeName: '5% Bonus on Losses Below ₹50,000', paidOut: 103, timestamp: '2026-06-19 11:42', metricMet: '5X Rollover Complete', status: 'Approved & Liquidated' },
  { id: 'cl4', username: 'rohit_99', schemeName: 'Daily Deposit Bonus', paidOut: 100, timestamp: '2026-06-21 09:05', metricMet: '5X Rollover Complete', status: 'Approved & Liquidated' }
];

const VIP_RANKS = [
  {
    name: 'BRONZE',
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    nextName: 'Silver',
    currentProgress: 35000,
    targetProgress: 100000,
    progressPercent: 35,
    bonusAmount: 1000,
    bonusCurrency: '₱',
    shieldColor: '#B45309',
    chevronColor: '#D97706',
    subChevrons: ['#F59E0B', '#D97706']
  },
  {
    name: 'SILVER',
    badgeColor: 'text-slate-300 bg-slate-400/10 border-slate-400/20',
    nextName: 'Gold',
    currentProgress: 100000,
    targetProgress: 250000,
    progressPercent: 40,
    bonusAmount: 5000,
    bonusCurrency: '₱',
    shieldColor: '#E2E8F0',
    chevronColor: '#60A5FA',
    subChevrons: ['#60A5FA', '#3B82F6']
  },
  {
    name: 'GOLD',
    badgeColor: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    nextName: 'Platinum',
    currentProgress: 250000,
    targetProgress: 500000,
    progressPercent: 50,
    bonusAmount: 15000,
    bonusCurrency: '₱',
    shieldColor: '#F59E0B',
    chevronColor: '#FBBF24',
    subChevrons: ['#FBBF24', '#F59E0B']
  },
  {
    name: 'PLATINUM',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    nextName: 'Diamond',
    currentProgress: 500000,
    targetProgress: 1000000,
    progressPercent: 50,
    bonusAmount: 50000,
    bonusCurrency: '₱',
    shieldColor: '#818CF8',
    chevronColor: '#A5B4FC',
    subChevrons: ['#A5B4FC', '#6366F1']
  }
];

export default function BonusSettingsView({ 
  onSaveBonusRules,
  activeSubTab = 'schemes',
  onSubTabChange 
}: BonusSettingsViewProps) {

  // Dynamic state hooks for active interactions
  const [schemes, setSchemes] = useState<BonusScheme[]>(INITIAL_SCHEMES);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(INITIAL_ENROLLMENTS);
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for creating a new scheme
  const [schemeName, setSchemeName] = useState('');
  const [schemeType, setSchemeType] = useState('DAILY_DEP');
  const [schemeTypeLabel, setSchemeTypeLabel] = useState('DAILY DEPOSIT');
  const [schemeDescription, setSchemeDescription] = useState('');
  const [schemeReward, setSchemeReward] = useState('10');
  const [schemeRollover, setSchemeRollover] = useState('5');

  // Existing general config rules props state
  const [welcomeBonusPercent, setWelcomeBonusPercent] = useState(SYSTEM_BONUS_SETTINGS.welcomeBonusPercent);
  const [welcomeBonusMax, setWelcomeBonusMax] = useState(SYSTEM_BONUS_SETTINGS.welcomeBonusMax);
  const [wageringRequirements, setWageringRequirements] = useState(SYSTEM_BONUS_SETTINGS.wageringRequirements);
  const [dailyCashbackPercent, setDailyCashbackPercent] = useState(SYSTEM_BONUS_SETTINGS.dailyCashbackPercent);
  const [minDepositForBonus, setMinDepositForBonus] = useState(SYSTEM_BONUS_SETTINGS.minDepositForBonus);
  const [enabledReferralReward, setEnabledReferralReward] = useState(SYSTEM_BONUS_SETTINGS.enabledReferralReward);
  const [bonusNotification, setBonusNotification] = useState<string | null>(null);

  // Platform commissions (from general settings)
  const [platformCommissionFee, setPlatformCommissionFee] = useState(2.5);
  const [dailyWithdrawLimit, setDailyWithdrawLimit] = useState(50000);
  const [restrictBannedIps, setRestrictBannedIps] = useState(true);

  // Premium KPI Card interactive states
  const [currentRankIndex, setCurrentRankIndex] = useState(1); // Default to Silver (index 1)
  const [rakebackAmount, setRakebackAmount] = useState(561.87);
  const [weeklyTimer, setWeeklyTimer] = useState({ days: 12, hours: 18, mins: 14, secs: 11 });
  const [monthlyTimer, setMonthlyTimer] = useState({ days: 12, hours: 18, mins: 14, secs: 11 });

  // Ticking countdown effect for the premium KPI Cards
  useEffect(() => {
    const timerId = setInterval(() => {
      // Tick weekly timer
      setWeeklyTimer(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return { days: 12, hours: 18, mins: 14, secs: 11 }; // reset/loop
      });
      // Tick monthly timer
      setMonthlyTimer(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return { days: 12, hours: 18, mins: 14, secs: 11 }; // reset/loop
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // IOS Liquid Glass Modal config state
  const [modalControl, setModalControl] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'default' | 'danger' | 'info' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const launchIOSConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: { confirmText?: string; cancelText?: string; type?: 'default' | 'danger' | 'info' | 'success' }
  ) => {
    setModalControl({
      isOpen: true,
      title,
      message,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      type: options?.type || 'default',
      onConfirm: () => {
        onConfirm();
        setModalControl(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const triggerNotify = (msg: string) => {
    setBonusNotification(msg);
    setTimeout(() => setBonusNotification(null), 4000);
  };

  const handleCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeName.trim() || !schemeDescription.trim()) {
      alert('Please fill out all fields first.');
      return;
    }

    const newSchemeItem: BonusScheme = {
      id: `scheme_${Date.now()}`,
      name: schemeName,
      type: schemeType,
      typeLabel: schemeTypeLabel,
      description: `${schemeDescription}. ${schemeRollover}X rolling mandatory.`,
      enrolled: 0,
      claims: 0,
      paidOut: 0,
      isActive: true
    };

    setSchemes([newSchemeItem, ...schemes]);
    triggerNotify(`Promo scheme "${schemeName}" launched successfully!`);
    
    // reset fields
    setSchemeName('');
    setSchemeDescription('');
    setSchemeReward('10');
    setSchemeRollover('5');
    
    // Switch back to schemes catalog automatically
    if (onSubTabChange) {
      onSubTabChange('schemes');
    }
  };

  const handleToggleState = (id: string) => {
    setSchemes(schemes.map(s => {
      if (s.id === id) {
        const nextState = !s.isActive;
        triggerNotify(`Promo scheme "${s.name}" is now ${nextState ? 'Active' : 'Paused'}.`);
        return { ...s, isActive: nextState };
      }
      return s;
    }));
  };

  const handleDeleteScheme = (id: string) => {
    const target = schemes.find(s => s.id === id);
    if (!target) return;
    launchIOSConfirm(
      'Retire Promo Campaign',
      `Are you sure you want to retire the promotion "${target.name}"? This cannot be undone.`,
      () => {
        setSchemes(schemes.filter(s => s.id !== id));
        triggerNotify(`Retired promo scheme: "${target.name}"`);
      },
      { confirmText: 'Retire', type: 'danger' }
    );
  };

  const handleReleaseBonus = (id: string) => {
    const target = enrollments.find(e => e.id === id);
    if (!target) return;
    
    launchIOSConfirm(
      'Force Release Promo Funds',
      `You are about to instantly clear and credit ₹${target.bonusAmount} in real withdrawable assets to @${target.username}. Proceed with liquidation?`,
      () => {
        // Add to claims history
        const newClaim: Claim = {
          id: `cl_${Date.now()}`,
          username: target.username,
          schemeName: target.schemeName,
          paidOut: target.bonusAmount,
          metricMet: 'Admin Force Release',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'Approved & Liquidated'
        };

        setClaims([newClaim, ...claims]);
        // update scheme totals
        setSchemes(schemes.map(s => {
          if (s.name === target.schemeName) {
            return {
              ...s,
              claims: s.claims + 1,
              paidOut: s.paidOut + target.bonusAmount
            };
          }
          return s;
        }));

        setEnrollments(enrollments.filter(e => e.id !== id));
        triggerNotify(`Accrued funds of ₹${target.bonusAmount} released as withdrawable asset to client @${target.username}!`);
      },
      { confirmText: 'Release Cash', type: 'success' }
    );
  };

  const handleRevokeBonus = (id: string) => {
    const target = enrollments.find(e => e.id === id);
    if (!target) return;
    launchIOSConfirm(
      'Revoke Promo Enrollment',
      `Are you sure you want to revoke the active promo bonus for @${target.username}? This wipes out all current wagering rollover progress.`,
      () => {
        setEnrollments(enrollments.filter(e => e.id !== id));
        triggerNotify(`Revoked active enrollment badge for client @${target.username}.`);
      },
      { confirmText: 'Revoke', type: 'danger' }
    );
  };

  const handleSaveGeneralConfigSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBonusRules({
      welcomeBonusPercent,
      welcomeBonusMax,
      wageringRequirements,
      dailyCashbackPercent,
      minDepositForBonus,
      enabledReferralReward
    });
    triggerNotify('Gateway and system parameters cached successfully.');
  };

  const filteredSchemes = schemes.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.typeLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const totalEnrols = enrollments.length + schemes.reduce((acc, s) => acc + s.enrolled, 0);
  const totalPaidOutSum = schemes.reduce((acc, s) => acc + s.paidOut, 0);
  const totalClaimsCount = claims.length;

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Actions section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-sans">
            <span>Admin</span>
            <span>&gt;</span>
            <span className="text-slate-400">Bonus</span>
            <span>&gt;</span>
            <span className="text-gold-500 capitalize">{activeSubTab.replace('-', ' ')}</span>
          </div>
          <h1 className="text-lg font-bold font-display text-white mt-1 uppercase tracking-wide flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-500" />
            Bonus Settings Engine
          </h1>
        </div>

        {/* Rapid Tab Switching Header buttons inside the page */}
        <div className="flex items-center bg-obsidian-950 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto max-w-full">
          <button
            onClick={() => onSubTabChange?.('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all whitespace-nowrap ${
              activeSubTab === 'overview'
                ? 'bg-slate-800 text-white font-bold border border-slate-700/85'
                : 'text-slate-450 hover:text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSubTabChange?.('schemes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all whitespace-nowrap ${
              activeSubTab === 'schemes'
                ? 'bg-slate-800 text-white font-bold border border-slate-700/85'
                : 'text-slate-450 hover:text-slate-300'
            }`}
          >
            Schemes
          </button>
          <button
            onClick={() => onSubTabChange?.('add-scheme')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all whitespace-nowrap ${
              activeSubTab === 'add-scheme'
                ? 'bg-slate-800 text-white font-bold border border-slate-700/85'
                : 'text-slate-450 hover:text-slate-300'
            }`}
          >
            + Add Scheme
          </button>
          <button
            onClick={() => onSubTabChange?.('enrollments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all whitespace-nowrap ${
              activeSubTab === 'enrollments'
                ? 'bg-slate-800 text-white font-bold border border-slate-700/85'
                : 'text-slate-450 hover:text-slate-300'
            }`}
          >
            Enrollments
          </button>
          <button
            onClick={() => onSubTabChange?.('claims')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all whitespace-nowrap ${
              activeSubTab === 'claims'
                ? 'bg-slate-800 text-white font-bold border border-slate-700/85'
                : 'text-slate-450 hover:text-slate-300'
            }`}
          >
            Claims History
          </button>
          <button
            onClick={() => onSubTabChange?.('payment-config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all whitespace-nowrap ${
              activeSubTab === 'payment-config'
                ? 'bg-slate-800 text-white font-bold border border-slate-700/85'
                : 'text-slate-450 hover:text-slate-300'
            }`}
          >
            Payment Config
          </button>
        </div>
      </div>

      {bonusNotification && (
        <div className="p-3 bg-emerald-950/45 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-sans font-medium flex items-center gap-2.5 animate-fadeIn shadow-lg">
          <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
          <span>{bonusNotification}</span>
        </div>
      )}

      {/* 1. OVERVIEW VIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-11 gap-4">
            
            {/* Card 1: VIP Progress Slider Card */}
            <div className="md:col-span-2 xl:col-span-5 bg-obsidian-900 border border-slate-800/80 rounded-2xl relative overflow-hidden flex flex-col justify-between p-5 min-h-[220px] shadow-lg group">
              {/* Side Arrow Navigation Buttons */}
              <button
                type="button"
                onClick={() => setCurrentRankIndex(prev => (prev === 0 ? VIP_RANKS.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-950/70 hover:bg-[#4E5DFD] hover:text-white text-slate-400 rounded-full flex items-center justify-center transition-colors border border-slate-800/80 z-10 cursor-pointer shadow"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentRankIndex(prev => (prev === VIP_RANKS.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-950/70 hover:bg-[#4E5DFD] hover:text-white text-slate-400 rounded-full flex items-center justify-center transition-colors border border-slate-800/80 z-10 cursor-pointer shadow"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Shield & Badge Popping out */}
              <div className="flex flex-col items-center justify-center pt-1 relative">
                {/* Info circle on top left */}
                <div className="absolute top-0 left-2 text-slate-500 hover:text-slate-300 transition-colors cursor-help">
                  <Info className="w-3.5 h-3.5" />
                </div>

                {/* Beautiful SVG PENTAGON SHIELD */}
                <div className="transform -translate-y-2 filter drop-shadow-[0_0_15px_rgba(78,93,253,0.15)] hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 100 110" className="w-16 h-18">
                    <polygon 
                      points="50,5 92,30 78,95 50,110 22,95 8,30" 
                      fill="url(#shieldMetallic)" 
                      stroke={VIP_RANKS[currentRankIndex].shieldColor} 
                      strokeWidth="3" 
                    />
                    <polygon 
                      points="50,14 84,34 72,86 50,98 28,86 16,34" 
                      fill="#11131e" 
                      stroke="#4E5DFD" 
                      strokeWidth="1.5" 
                      opacity="0.9" 
                    />
                    {/* Glowing chevrons inside */}
                    <path 
                      d="M32,45 L50,60 L68,45" 
                      fill="none" 
                      stroke={VIP_RANKS[currentRankIndex].subChevrons[0]} 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <path 
                      d="M32,60 L50,75 L68,60" 
                      fill="none" 
                      stroke={VIP_RANKS[currentRankIndex].subChevrons[1]} 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    
                    <defs>
                      <linearGradient id="shieldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="35%" stopColor={VIP_RANKS[currentRankIndex].shieldColor} />
                        <stop offset="75%" stopColor="#1E293B" />
                        <stop offset="100%" stopColor={VIP_RANKS[currentRankIndex].shieldColor} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <h3 className="text-xs font-extrabold text-white tracking-[0.25em] font-display uppercase mt-0.5">
                  {VIP_RANKS[currentRankIndex].name}
                </h3>
              </div>

              {/* Progress Bar & Badges */}
              <div className="space-y-1.5 mt-1 px-4">
                <div className="flex items-center justify-between text-[10px]">
                  {/* Current Rank Badge */}
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                    <span className="h-1 w-1 bg-emerald-400 rounded-full animate-ping" />
                    {VIP_RANKS[currentRankIndex].name.toLowerCase()}
                  </span>
                  {/* Next Rank Badge */}
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-semibold">
                    {VIP_RANKS[currentRankIndex].nextName}
                  </span>
                </div>

                {/* Elegant green progress bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-700 relative overflow-hidden"
                    style={{ width: `${VIP_RANKS[currentRankIndex].progressPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:12px_12px] animate-[progress_1s_linear_infinite]" />
                  </div>
                </div>

                {/* Numeric metrics */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{VIP_RANKS[currentRankIndex].currentProgress.toLocaleString()}</span>
                  <span>{VIP_RANKS[currentRankIndex].targetProgress.toLocaleString()}</span>
                </div>
              </div>

              {/* Bottom Action Section */}
              <div className="mt-3 flex items-center justify-center gap-2 px-4">
                <div className="bg-[#181a26] border border-amber-500/35 hover:border-amber-400 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-amber-400 flex items-center gap-1.5 shadow-inner transition-colors">
                  <span>Take the bonus</span>
                  <span className="flex items-center gap-0.5 font-mono text-amber-300">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    {VIP_RANKS[currentRankIndex].bonusCurrency}{VIP_RANKS[currentRankIndex].bonusAmount.toLocaleString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerNotify(`Claimed ${VIP_RANKS[currentRankIndex].name} Rank VIP Bonus of ${VIP_RANKS[currentRankIndex].bonusCurrency}${VIP_RANKS[currentRankIndex].bonusAmount.toLocaleString()}!`);
                    launchIOSConfirm(
                      'VIP Rank Bonus Disbursed',
                      `You have successfully acquired the ${VIP_RANKS[currentRankIndex].name} VIP Rank tier reward. A promotional claim of ${VIP_RANKS[currentRankIndex].bonusCurrency}${VIP_RANKS[currentRankIndex].bonusAmount.toLocaleString()} has been credited to your active wallet balance.`,
                      () => {}
                    );
                  }}
                  className="bg-slate-950 text-slate-100 border border-slate-750 hover:border-amber-400 hover:text-amber-400 font-extrabold px-3 py-1.5 rounded-lg text-[10px] tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Claim
                </button>
              </div>
            </div>

            {/* Card 2: Available Rakeback Card */}
            <div className="xl:col-span-2 bg-gradient-to-b from-[#dfaa43] to-[#ad751b] border border-[#ffdb7d]/50 rounded-[28px] relative overflow-hidden p-5 flex flex-col justify-between min-h-[220px] shadow-lg group hover:border-[#ffdb7d]/70 transition-all duration-300">
              
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-white/95 tracking-tight font-sans">
                  Available rakeback
                </span>
                <button type="button" className="w-5 h-5 bg-black/15 hover:bg-black/25 text-white/75 rounded-full flex items-center justify-center transition-colors cursor-help">
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Left Aligned Content */}
              <div className="my-1.5 text-left relative z-10">
                <h2 className="text-3xl font-extrabold text-[#fffde9] font-sans tracking-tight drop-shadow-sm pl-0.5">
                  {rakebackAmount > 0 ? `₱${rakebackAmount.toFixed(2)}` : '₱0.00'}
                </h2>
                
                {/* Percentage Capsule */}
                <span className="inline-block mt-2 px-3 py-1 rounded-xl bg-white/10 text-white/95 border border-white/5 text-[11px] font-medium">
                  Current percentage: 4%
                </span>
              </div>

              {/* Gold Coins graphic stacking up */}
              <div className="absolute bottom-12 right-0 w-32 h-18 overflow-hidden pointer-events-none opacity-90 group-hover:scale-105 transition-transform duration-500">
                <svg viewBox="0 0 100 60" className="w-full h-full transform translate-y-3 translate-x-2">
                  <circle cx="20" cy="45" r="14" fill="url(#goldGradCard)" stroke="#92400e" strokeWidth="0.8" />
                  <circle cx="20" cy="45" r="11" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="2,1" opacity="0.3" />
                  
                  <circle cx="45" cy="35" r="15" fill="url(#goldGradCard)" stroke="#92400e" strokeWidth="0.8" />
                  <circle cx="45" cy="35" r="12" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="2,1" opacity="0.3" />
                  
                  <circle cx="75" cy="40" r="16" fill="url(#goldGradCard)" stroke="#78350f" strokeWidth="1" />
                  <circle cx="75" cy="40" r="13" fill="none" stroke="#fef08a" strokeWidth="0.5" strokeDasharray="2,1" opacity="0.4" />
                  
                  {/* Clover pattern on right coin */}
                  <g transform="translate(75, 40) scale(0.7)">
                    <path d="M0,-6 C-2,-6 -2,-2 0,0 C2,-2 2,-6 0,-6 Z" fill="#78350f" opacity="0.5" />
                    <path d="M0,6 C-2,6 -2,2 0,0 C2,2 2,6 0,6 Z" fill="#78350f" opacity="0.5" />
                    <path d="M-6,0 C-6,-2 -2,-2 0,0 C-2,2 -6,2 -6,0 Z" fill="#78350f" opacity="0.5" />
                    <path d="M6,0 C6,-2 2,-2 0,0 C2,2 6,2 6,0 Z" fill="#78350f" opacity="0.5" />
                  </g>
                  
                  <defs>
                    <radialGradient id="goldGradCard" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#fffbeb" />
                      <stop offset="25%" stopColor="#fef08a" />
                      <stop offset="65%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#854d0e" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Full width Claim button */}
              <div className="relative z-10 pt-1">
                <button
                  type="button"
                  disabled={rakebackAmount === 0}
                  onClick={() => {
                    if (rakebackAmount === 0) return;
                    const reward = rakebackAmount;
                    setRakebackAmount(0);
                    triggerNotify(`Rakeback reward of ₱${reward.toFixed(2)} disbursed to your balance!`);
                    launchIOSConfirm(
                      'Rakeback Claim Disbursed',
                      `You have successfully claimed ₱${reward.toFixed(2)} available rakeback. The funds have been synchronized with your live casino account registry.`,
                      () => {}
                    );
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)] active:scale-[0.98] ${
                    rakebackAmount > 0 
                      ? 'bg-[#141318] hover:bg-[#1e1d23] text-white border border-white/5 cursor-pointer' 
                      : 'bg-black/40 text-white/30 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  Claim
                </button>
              </div>
            </div>

            {/* Card 3: Weekly Boost Card */}
            <div className="xl:col-span-2 bg-gradient-to-b from-[#112417] to-[#0a140f] border border-[#3ed25f] rounded-[28px] relative overflow-hidden p-5 flex flex-col justify-between min-h-[220px] shadow-lg group hover:border-[#3ed25f]/80 transition-all duration-300">
              
              {/* Sunburst Rays Background Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none opacity-[0.06] z-0">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_40s_linear_infinite]">
                  <path d="M50,50 L50,0 M50,50 L75,10 M50,50 L90,25 M50,50 L100,50 M50,50 L90,75 M50,50 L75,90 M50,50 L50,100 M50,50 L25,90 M50,50 L10,75 M50,50 L0,50 M50,50 L10,25 M50,50 L25,10" stroke="#3ed25f" strokeWidth="6" />
                </svg>
              </div>

              {/* Top Badge header */}
              <div className="flex items-center justify-between relative z-10">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1.5">
                  <span className="px-5 py-1 bg-[#3ed25f] text-[#051c0d] font-black text-[10px] tracking-widest rounded-b-lg uppercase shadow-[0_2px_10px_rgba(62,210,95,0.25)]">
                    WEEKLY
                  </span>
                </div>
                <div className="ml-auto">
                  <button type="button" className="w-5 h-5 bg-black/15 hover:bg-black/25 text-emerald-400/80 hover:text-emerald-300 rounded-full flex items-center justify-center transition-colors cursor-help">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Centered Core values */}
              <div className="text-center my-2 space-y-0.5 relative z-10">
                <h2 className="text-2xl font-black text-[#3ed25f] font-sans tracking-tight">
                  ₱287.92
                </h2>
                <p className="text-[10px] tracking-[0.2em] font-extrabold text-white/95 uppercase">
                  BOOST
                </p>
                <div className="inline-block mt-3 px-3 py-1 rounded-xl bg-black/45 text-[#3ed25f]/90 border border-[#3ed25f]/15 text-[10px] font-medium">
                  Current percentage: 5%
                </div>
              </div>

              {/* Countdown Timer footer */}
              <div className="border-t border-white/5 pt-3 text-center mt-1 relative z-10">
                <div className="flex items-center justify-center gap-3.5">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white leading-none">{String(weeklyTimer.days).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase text-slate-500 font-bold tracking-wider mt-1">Day</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white leading-none">{String(weeklyTimer.hours).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase text-slate-500 font-bold tracking-wider mt-1">H</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white leading-none">{String(weeklyTimer.mins).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase text-slate-500 font-bold tracking-wider mt-1">Min</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white leading-none">{String(weeklyTimer.secs).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase text-slate-500 font-bold tracking-wider mt-1">Sec</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Monthly Reload Card */}
            <div className="xl:col-span-2 bg-gradient-to-b from-[#111e35] to-[#080d1a] border border-[#3b82f6] rounded-[28px] relative overflow-hidden p-5 flex flex-col justify-between min-h-[220px] shadow-lg group hover:border-[#3b82f6]/80 transition-all duration-300">
              
              {/* Sunburst Rays Background Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none opacity-[0.06] z-0">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_40s_linear_infinite]">
                  <path d="M50,50 L50,0 M50,50 L75,10 M50,50 L90,25 M50,50 L100,50 M50,50 L90,75 M50,50 L75,90 M50,50 L50,100 M50,50 L25,90 M50,50 L10,75 M50,50 L0,50 M50,50 L10,25 M50,50 L25,10" stroke="#3b82f6" strokeWidth="6" />
                </svg>
              </div>

              {/* Top Badge header */}
              <div className="flex items-center justify-between relative z-10">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1.5">
                  <span className="px-5 py-1.5 bg-[#3b82f6] text-[#050b18] font-black text-[10px] tracking-widest rounded-b-lg uppercase shadow-[0_2px_10px_rgba(59,130,246,0.25)]">
                    MONTHLY
                  </span>
                </div>
                <div className="ml-auto">
                  <button type="button" className="w-5 h-5 bg-black/15 hover:bg-black/25 text-blue-400/80 hover:text-blue-300 rounded-full flex items-center justify-center transition-colors cursor-help">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Centered Core values */}
              <div className="text-center my-2 space-y-0.5 relative z-10">
                <h2 className="text-2xl font-black text-[#3b82f6] font-sans tracking-tight">
                  ₱107.34
                </h2>
                <p className="text-[10px] tracking-[0.2em] font-extrabold text-white/95 uppercase">
                  RELOAD
                </p>
                <div className="inline-block mt-3 px-3 py-1 rounded-xl bg-black/45 text-[#3b82f6]/90 border border-[#3b82f6]/15 text-[10px] font-medium">
                  Current percentage: 3%
                </div>
              </div>

              {/* Countdown Timer footer */}
              <div className="border-t border-white/5 pt-3 text-center mt-1 relative z-10">
                <div className="flex items-center justify-center gap-3.5">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white leading-none">{String(monthlyTimer.days).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase text-slate-500 font-bold tracking-wider mt-1">Day</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white leading-none">{String(monthlyTimer.hours).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase text-slate-500 font-bold tracking-wider mt-1">H</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white leading-none">{String(monthlyTimer.mins).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase text-slate-500 font-bold tracking-wider mt-1">Min</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white leading-none">{String(monthlyTimer.secs).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase text-slate-500 font-bold tracking-wider mt-1">Sec</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-obsidian-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                  Promotion Enrollment Performance
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">Distribution audit of active promotional targets</p>
              </div>

              <div className="space-y-3.5 pt-2">
                {schemes.map(s => {
                  const percentage = totalEnrols > 0 ? Math.round((s.enrolled / totalEnrols) * 100) : 0;
                  return (
                    <div key={s.id} className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="font-semibold">{s.name}</span>
                        <div className="flex gap-4 font-mono text-[11px] text-slate-400">
                          <span>{s.enrolled} Enrolled</span>
                          <span className="text-emerald-400 font-bold">₹{s.paidOut} paid</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850/60">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-[#4E5DFD] h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.max(percentage, 8)}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-obsidian-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                  Promo Risk Auditor
                </h3>
                <p className="text-slate-400 text-xs mt-0.5 font-sans">
                  Current platform yield settings and risk levels
                </p>
              </div>

              <div className="bg-slate-950/80 p-4 border border-slate-850 rounded-xl space-y-3 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Welcome match ceiling</span>
                  <span className="font-semibold text-white">{welcomeBonusPercent}% match</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Direct bounty rate</span>
                  <span className="font-semibold text-white">₹{enabledReferralReward} / User</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Wagering lockout rate</span>
                  <span className="font-semibold text-emerald-400">{wageringRequirements}X Rollover</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rake platform margin</span>
                  <span className="font-semibold text-amber-500">{platformCommissionFee}%</span>
                </div>
              </div>

              <button
                onClick={() => onSubTabChange?.('add-scheme')}
                className="w-full py-2.5 premium-gradient-glow text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Launch Custom Promo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SCHEMES SCHEMES SCHEMES CATALOG */}
      {activeSubTab === 'schemes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-obsidian-900/60 p-4 rounded-xl border border-slate-850">
            <span className="text-xs font-bold text-slate-300 font-sans">
              {filteredSchemes.length} scheme(s) total
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search schemes */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search schemas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-[#4E5DFD]/55 font-sans"
                />
              </div>

              <button
                onClick={() => onSubTabChange?.('add-scheme')}
                className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 border border-amber-300/30 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow transitions active:scale-95"
              >
                <PlusCircle className="h-3.5 w-3.5 text-slate-950" />
                + New Scheme
              </button>
            </div>
          </div>

          {/* Grid of scheme cards matches screenshot perfectly! */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((s) => {
              // Custom themes based on Scheme Type
              const isWelcome = s.type === 'WELCOME';
              const isFirstDep = s.type === 'FIRST_DEP';
              const isDaily = s.type === 'DAILY_DEP';
              const isLossAbove = s.type === 'LOSS_ABOVE';
              const isLossBelow = s.type === 'LOSS_BELOW';

              let badgeColors = "bg-amber-500/10 text-amber-400 border-amber-500/20";
              let iconColors = "bg-amber-500/10 text-amber-500 border-amber-500/20";
              let activeBorderColor = "hover:border-amber-500/30 border-slate-800/80 shadow-amber-950/5";

              if (isFirstDep) {
                badgeColors = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
                iconColors = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
                activeBorderColor = "hover:border-cyan-500/30 border-slate-800/80 shadow-cyan-950/5";
              } else if (isDaily) {
                badgeColors = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                iconColors = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                activeBorderColor = "hover:border-emerald-500/30 border-slate-800/80 shadow-emerald-950/5";
              } else if (isLossAbove || isLossBelow) {
                badgeColors = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                iconColors = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                activeBorderColor = "hover:border-rose-500/30 border-slate-800/80 shadow-rose-950/5";
              }

              return (
                <div 
                  key={s.id} 
                  className={`bg-obsidian-900 border transition-all duration-300 rounded-2xl p-5.5 flex flex-col justify-between hover:translate-y-[-2px] relative overflow-hidden group ${
                    s.isActive 
                      ? `border-indigo-500/25 shadow-xl shadow-indigo-950/15 ${activeBorderColor}` 
                      : 'border-slate-800/40 opacity-70 hover:opacity-100 shadow-sm'
                  }`}
                >
                  {/* Subtle top background ambient glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br rounded-full blur-3xl opacity-5 pointer-events-none transition-opacity duration-300 group-hover:opacity-10 ${
                    isWelcome ? 'from-amber-500 to-transparent' :
                    isFirstDep ? 'from-cyan-500 to-transparent' :
                    isDaily ? 'from-emerald-500 to-transparent' :
                    'from-rose-500 to-transparent'
                  }`} />

                  <div>
                    {/* Header bar */}
                    <div className="flex justify-between items-start gap-2 border-b border-slate-850/60 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl border transition-transform duration-300 group-hover:scale-105 ${iconColors}`}>
                          <Gift className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-[13px] font-extrabold text-white font-sans tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">
                            {s.name}
                          </h4>
                          <span className="text-[9px] text-slate-500 font-mono block mt-1 uppercase tracking-wider font-semibold">
                            ID: {s.id.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 border text-center font-mono text-[9px] uppercase tracking-wider rounded-full font-bold ${badgeColors}`}>
                        {s.typeLabel}
                      </span>
                    </div>

                    {/* Description text */}
                    <p className="text-[11px] text-slate-450 font-sans leading-relaxed min-h-[44px] px-0.5">
                      {s.description}
                    </p>

                    {/* Quantitative Stats Matrix */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/80 rounded-xl p-3 my-4.5 border border-slate-850/60 font-mono text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
                      <div className="relative z-10">
                        <p className="text-lg font-black text-slate-200 tracking-tight">{s.enrolled}</p>
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Enrolled</p>
                      </div>
                      <div className="border-x border-slate-850/60 relative z-10">
                        <p className="text-lg font-black text-slate-200 tracking-tight">{s.claims}</p>
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Claims</p>
                      </div>
                      <div className="relative z-10">
                        <p className="text-lg font-black text-emerald-neon tracking-tight">₹{s.paidOut.toLocaleString()}</p>
                        <p className="text-[8px] text-emerald-500/80 uppercase tracking-widest font-bold mt-0.5">Paid Out</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Controls */}
                  <div className="flex items-center justify-between border-t border-slate-850/70 pt-4 mt-2">
                    {/* Active / Inactive switch component */}
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={s.isActive}
                          onChange={() => handleToggleState(s.id)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4.5 bg-slate-850 rounded-full peer peer-checked:after:translate-x-3.5 after:content-[''] after:absolute after:top-[2px] after:left-[2.5px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500" />
                      </label>
                      <span className={`text-[10px] font-bold uppercase transition-colors ${s.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {s.isActive ? 'Active' : 'Muted'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSchemeName(s.name);
                          setSchemeDescription(s.description.replace(' 5X rolling.', '').replace(' 10X rolling mandatory.', ''));
                          setSchemeType(s.type);
                          setSchemeTypeLabel(s.typeLabel);
                          onSubTabChange?.('add-scheme');
                        }}
                        className="px-3 py-1.5 text-[10px] bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-lg font-bold transition-all focus:outline-none hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteScheme(s.id)}
                        className="px-3 py-1.5 text-[10px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-lg font-bold transition-all focus:outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ADD NEW SCHEME FORM VIEW */}
      {activeSubTab === 'add-scheme' && (
        <div className="max-w-2xl mx-auto bg-obsidian-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-fadeIn space-y-6">
          <div className="border-b border-slate-850 pb-4">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              <Gift className="h-4.5 w-4.5 text-amber-500" />
              Configure & Deploy Promotional Scheme
            </h3>
            <p className="text-slate-400 text-xs font-sans mt-1">
              Add new live client matches, rebate structures, or VIP turnover rewards
            </p>
          </div>

          <form onSubmit={handleCreateScheme} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                Scheme Campaign Name
              </label>
              <input
                type="text"
                placeholder="e.g. Saturday Night 50% Match Bonus"
                value={schemeName}
                onChange={(e) => setSchemeName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 rounded px-3 py-2 text-white font-sans outline-none focus:border-[#4E5DFD]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                  Campaign Category / Type
                </label>
                <select
                  value={schemeType}
                  onChange={(e) => {
                    setSchemeType(e.target.value);
                    const selectedOption = e.target.selectedOptions[0];
                    setSchemeTypeLabel(selectedOption.text);
                  }}
                  className="w-full bg-slate-950 border border-slate-800/80 rounded px-3 py-2 text-white font-sans outline-none focus:border-[#4E5DFD]"
                >
                  <option value="WELCOME">WELCOME</option>
                  <option value="FIRST_DEP">FIRST DEPOSIT</option>
                  <option value="DAILY_DEP">DAILY DEPOSIT</option>
                  <option value="LOSS_ABOVE">LOSS ABOVE</option>
                  <option value="LOSS_BELOW">LOSS BELOW</option>
                  <option value="VIP_REWARD">VIP MILESTONE</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                  Wagering Rollover Lock (Multiplier)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    placeholder="5"
                    value={schemeRollover}
                    onChange={(e) => setSchemeRollover(e.target.value)}
                    className="w-24 bg-slate-950 border border-slate-800/80 rounded px-3 py-2 text-white font-sans font-medium"
                  />
                  <span className="text-slate-450">X turnover is mandatory to unlock withdrawal</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                Promo Campaign Details Description
              </label>
              <textarea
                rows={3}
                placeholder="Give clients detail summary: e.g. 100% bonus on your first deposit, up to ₹5,000"
                value={schemeDescription}
                onChange={(e) => setSchemeDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 rounded px-3 py-2 text-white font-sans outline-none focus:border-[#4E5DFD]"
              />
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 text-slate-450 leading-relaxed font-sans text-[11px] space-y-1.5">
              <p className="font-semibold text-slate-300">Automatic Whitelisting Policies:</p>
              <p>• Promotional matches are registered instantly to eligible participant lists.</p>
              <p>• Client ledger balances are securely computed with a locked rollover state until conditions are met.</p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-850">
              <button
                type="button"
                onClick={() => onSubTabChange?.('schemes')}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs rounded-xl transition-all outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 premium-gradient-glow text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
              >
                Launch Scheme Campaign
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. ENROLLMENTS TRACKING */}
      {activeSubTab === 'enrollments' && (
        <div className="bg-obsidian-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
          <div className="p-5 border-b border-slate-850 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                Active Promo Enrollments
              </h3>
              <p className="text-slate-400 text-xs font-sans">
                Real-time rollover auditing of active clients under promotional lockout
              </p>
            </div>

            <span className="px-3 py-1 bg-slate-950 border border-slate-850 text-amber-500 font-mono text-xs rounded-lg">
              {enrollments.length} Active Participants
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-slate-300">
              <thead className="bg-slate-950/60 uppercase font-mono text-[10px] tracking-wider text-slate-500 border-b border-slate-850">
                <tr>
                  <th className="py-3 px-5">Client Username</th>
                  <th className="py-3 px-5">Campaign Scheme</th>
                  <th className="py-3 px-5">Promo Fund</th>
                  <th className="py-3 px-5">Rollover Audit Progress</th>
                  <th className="py-3 px-5 text-center">Status Badge</th>
                  <th className="py-3 px-5 text-center">Enrolled Date</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {enrollments.map((enr) => {
                  const progressPercentage = Math.min(Math.round((enr.wageredProgress / enr.wageredTarget) * 100), 100);
                  return (
                    <tr key={enr.id} className="hover:bg-slate-900/30 transition-all">
                      <td className="py-3.5 px-5 font-bold text-white">
                        @{enr.username}
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-200">
                        {enr.schemeName}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-emerald-neon font-bold">
                        ₹{enr.bonusAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-5 space-y-1 w-64">
                        <div className="flex justify-between font-mono text-[10px] text-slate-450">
                          <span>₹{enr.wageredProgress.toLocaleString()} / ₹{enr.wageredTarget.toLocaleString()}</span>
                          <span className={`${progressPercentage === 100 ? 'text-emerald-neon font-bold' : 'text-slate-400'}`}>
                            {progressPercentage}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-850/80">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              progressPercentage === 100 ? 'bg-emerald-500' : 'bg-[#4E5DFD]'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide inline-block ${
                          enr.status === 'Unlocked' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' 
                            : 'bg-indigo-950 text-indigo-400 border border-indigo-900/45 animate-pulse'
                        }`}>
                          {enr.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center text-slate-450 font-mono">
                        {enr.dateEnrolled}
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-1.5">
                        <button
                          onClick={() => handleReleaseBonus(enr.id)}
                          className="px-2 py-1 text-[10px] bg-emerald-neon/15 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-extrabold rounded transition-all focus:outline-none cursor-pointer"
                          title="Force Release & Liquidate Bonus Funds"
                        >
                          Release
                        </button>
                        <button
                          onClick={() => handleRevokeBonus(enr.id)}
                          className="px-2 py-1 text-[10px] bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded border border-slate-800 transition-all focus:outline-none"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. CLAIMS HISTORY VIEW */}
      {activeSubTab === 'claims' && (
        <div className="bg-obsidian-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-fadeIn space-y-6">
          <div className="p-5 border-b border-slate-850 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                Liquidated Claims History
              </h3>
              <p className="text-slate-400 text-xs font-sans">
                Permanent ledger recording past promo transfers cleared into checking asset columns
              </p>
            </div>
            
            <div className="text-right text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-neon animate-pulse" />
              <span>Full Audit Cleared</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-slate-300">
              <thead className="bg-slate-950/60 uppercase font-mono text-[10px] tracking-wider text-slate-500 border-b border-slate-850">
                <tr>
                  <th className="py-3 px-5">Claim ID</th>
                  <th className="py-3 px-5">Player Username</th>
                  <th className="py-3 px-5">Promo Campaign</th>
                  <th className="py-3 px-5">Payout Released</th>
                  <th className="py-3 px-5 text-center">Rollover Met</th>
                  <th className="py-3 px-5 text-center">Settlement Timestamp</th>
                  <th className="py-3 px-5 text-right">Status Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {claims.map((cl) => (
                  <tr key={cl.id} className="hover:bg-slate-900/30 transition-all">
                    <td className="py-3.5 px-5 font-mono text-slate-450">
                      {cl.id}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-white">
                      @{cl.username}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-200">
                      {cl.schemeName}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-emerald-neon font-bold">
                      ₹{cl.paidOut.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="px-2 py-0.5 bg-slate-950 text-slate-300 rounded text-[10px] font-mono">
                        {cl.metricMet || '5X Rollover Complete'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center font-mono text-slate-450">
                      {cl.timestamp}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="px-2.5 py-1 bg-emerald-950/60 text-emerald-neon border border-emerald-900/40 text-[9px] uppercase tracking-wider font-bold rounded-lg inline-flex items-center gap-1.5 shadow-sm shadow-[#1C1A42]/10">
                        <Check className="h-3 w-3" />
                        {cl.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. PAYMENT CONFIG GATEWAYS COLS VIEW */}
      {activeSubTab === 'payment-config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Promotional configuration form (2 columns) */}
          <div className="lg:col-span-2 bg-obsidian-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <form onSubmit={handleSaveGeneralConfigSettings} className="space-y-6">
              <div className="border-b border-slate-850 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
                    <Settings className="h-4.5 w-4.5 text-gold-500" />
                    Gateway Commissions & Rake Rulebook
                  </h2>
                  <p className="text-slate-400 text-xs font-sans mt-0.5">
                    Fine tune payout tolerances, matching ceilings, and rollover triggers
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 premium-gradient-glow text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98]"
                >
                  Save Payment Rules
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-300 text-xs text-left">
                {/* Welcome Bonus percentage */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <span className="text-[10px] tracking-wider font-bold text-slate-500 uppercase flex justify-between">
                    Welcome Credit Match
                    <HelpCircle className="h-3.5 w-3.5" title="Multiplier applied to deposit match" />
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <div>
                      <label className="text-[10px] text-slate-400 font-sans block mb-1">Match Rate (%)</label>
                      <input
                        type="number"
                        value={welcomeBonusPercent}
                        onChange={(e) => setWelcomeBonusPercent(Number(e.target.value))}
                        className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-display font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-sans block mb-1">Max Benefit (₹)</label>
                      <input
                        type="number"
                        value={welcomeBonusMax}
                        onChange={(e) => setWelcomeBonusMax(Number(e.target.value))}
                        className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-display font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Wagering Requirements */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <span className="text-[10px] tracking-wider font-bold text-slate-500 uppercase block">
                    Bonus Lock & Rollover rate
                  </span>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Required Rollover multiplier</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={wageringRequirements}
                        onChange={(e) => setWageringRequirements(Number(e.target.value))}
                        className="w-24 bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-display font-medium"
                      />
                      <span className="text-slate-440 font-sans text-[11px]">x rollover to release funds</span>
                    </div>
                  </div>
                </div>

                {/* Cashback and Min Deposit */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <span className="text-[10px] tracking-wider font-bold text-slate-500 uppercase block">
                    Daily Rebates & Triggers
                  </span>
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Daily Cashback (%)</label>
                      <input
                        type="number"
                        value={dailyCashbackPercent}
                        onChange={(e) => setDailyCashbackPercent(Number(e.target.value))}
                        className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-display font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Min Dep for Bonus (₹)</label>
                      <input
                        type="number"
                        value={minDepositForBonus}
                        onChange={(e) => setMinDepositForBonus(Number(e.target.value))}
                        className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-display font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Referral / Agents Bonus reward */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <span className="text-[10px] tracking-wider font-bold text-slate-500 uppercase block">
                    Affiliate Incentives
                  </span>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Direct Referrer Bounty (₹)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={enabledReferralReward}
                        onChange={(e) => setEnabledReferralReward(Number(e.target.value))}
                        className="w-24 bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-sans font-medium"
                      />
                      <span className="text-slate-440 text-[11px]">Bounty per active invite</span>
                    </div>
                  </div>
                </div>

              </div>
            </form>

            <p className="text-[10px] text-slate-550 mt-6 border-t border-slate-850/60 pt-3 text-left">
              Disclaimer: Updates to billing parameters and commissions apply to future deposit settlements only.
            </p>
          </div>

          {/* Side General Config Settings (1 column) */}
          <div className="bg-obsidian-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5 text-left">
            <div className="border-b border-slate-850 pb-3">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
                <Settings className="h-4.5 w-4.5 text-gold-500" />
                Global Limit Controls
              </h3>
              <p className="text-slate-400 text-xs font-sans">
                Portal configuration margins and platform network firewalls
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Platform fee */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase font-sans flex justify-between">
                  Platform rake margin (%)
                  <span className="text-gold-500 font-display font-medium">{platformCommissionFee}%</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="15.0"
                  step="0.1"
                  value={platformCommissionFee}
                  onChange={(e) => setPlatformCommissionFee(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-gold-500"
                />
              </div>

              {/* Daily Withdrawal Limit */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Max Daily Withdrawal Settlement (₹)</label>
                <input
                  type="number"
                  value={dailyWithdrawLimit}
                  onChange={(e) => setDailyWithdrawLimit(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Toggle Block IP */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-lg border border-slate-850">
                <div>
                  <p className="font-semibold text-white">Restrict Threat IPs</p>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">Auto-block banned login attempts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={restrictBannedIps}
                    onChange={() => setRestrictBannedIps(!restrictBannedIps)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-slate-850 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-gold-500" />
                </label>
              </div>

              {/* Risk rating */}
              {platformCommissionFee < 1.0 && (
                <div className="p-3 bg-rose-950/20 border border-rose-950/40 rounded-lg text-xs text-rose-400 flex gap-2 animate-fadeIn font-medium">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                  <div>
                    <p className="font-bold">Dangerous Rake Ratio</p>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Rake ratio lower than 1.0% may incur platform hosting deficits. Recommend retaining 2.0% margins.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic iOS Liquid Glass Confirmation Overlay */}
      <IOSConfirmationModal
        isOpen={modalControl.isOpen}
        title={modalControl.title}
        message={modalControl.message}
        onConfirm={modalControl.onConfirm}
        onCancel={() => setModalControl(prev => ({ ...prev, isOpen: false }))}
        confirmText={modalControl.confirmText}
        cancelText={modalControl.cancelText}
        type={modalControl.type}
      />

    </div>
  );
}
