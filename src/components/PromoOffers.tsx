import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gift, ChevronRight, Share2, Award, Clipboard, Check, 
  RefreshCw, Sparkles, DollarSign, Trophy, Shield, HelpCircle, 
  Star, MessageSquare, Flame, CheckCircle2, ChevronLeft, Info 
} from 'lucide-react';
import { sound } from '../utils/audio';
import cupBonusImg from '../../assets/images/pngs/cup_bonus.png';
import { BetHistoryItem } from '../types';

interface PromoOffersProps {
  balance: number;
  updateBalance: (amount: number, gameType: any, multiplier: number, outcome: any) => void;
  hasClaimedWelcome: boolean;
  setHasClaimedWelcome: (val: boolean) => void;
  history?: BetHistoryItem[];
}

export default function PromoOffers({ 
  balance, 
  updateBalance, 
  hasClaimedWelcome, 
  setHasClaimedWelcome, 
  history = [] 
}: PromoOffersProps) {
  // Tabs: 'vip' | 'wheel' | 'referral'
  const [activeTab, setActiveTab] = useState<'vip' | 'wheel' | 'referral'>('vip');
  
  // Wheel states
  const [wheelSpinning, setWheelSpinning] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [hasSpunWheel, setHasSpunWheel] = useState<boolean>(false);
  const [wheelDegree, setWheelDegree] = useState<number>(0);
  const [wheelPrize, setWheelPrize] = useState<string>('');

  // Loyalty / VIP states for exact-match screen
  const [rakebackAmount, setRakebackAmount] = useState<number>(561.87);
  const [weeklyAmount, setWeeklyAmount] = useState<number>(287.92);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(107.34);
  const [vipBonusClaimed, setVipBonusClaimed] = useState<boolean>(false);
  const [rakebackClaimed, setRakebackClaimed] = useState<boolean>(false);
  
  const [selectedTierIdx, setSelectedTierIdx] = useState<number>(1); // Default to SILVER
  const loyaltyTiers = [
    { name: 'BRONZE', requiredMin: '10.000', requiredMax: '100.000', badgeCurrent: 'Bronze', badgeNext: 'Silver', progressPercent: 65, bonus: 1000, current: '35.000' },
    { name: 'SILVER', requiredMin: '100.000', requiredMax: '250.000', badgeCurrent: 'Silver', badgeNext: 'Gold', progressPercent: 45, bonus: 5000, current: '167.500' },
    { name: 'GOLD', requiredMin: '250.000', requiredMax: '1.000.000', badgeCurrent: 'Gold', badgeNext: 'Platinum', progressPercent: 20, bonus: 15000, current: '400.000' },
    { name: 'PLATINUM', requiredMin: '1.000.000', requiredMax: '5.000.000', badgeCurrent: 'Platinum', badgeNext: 'Diamond', progressPercent: 12, bonus: 50000, current: '1.480.000' }
  ];

  // Countdown timers state ticking down in real time
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 18,
    minutes: 14,
    seconds: 11
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          return { days: 12, hours: 18, minutes: 14, seconds: 11 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // History paginated items
  const [historyPage, setHistoryPage] = useState<number>(0);
  const historyPages = [
    [
      { date: "05.08.2023 18:15", percentage: "15%", description: "Registration bonus", amount: 1203.33 },
      { date: "03.08.2023 18:11", percentage: "15%", description: "Deposit Bonus", amount: 1159.08 },
      { date: "01.08.2023 14:42", percentage: "10%", description: "Deposit Bonus", amount: 900.26 },
      { date: "01.08.2023 14:42", percentage: "10%", description: "Deposit Bonus", amount: 50.01 },
      { date: "01.08.2023 12:05", percentage: "10%", description: "Registration bonus", amount: 10561.33 },
      { date: "01.08.2023 14:42", percentage: "10%", description: "Registration bonus", amount: 5724.82 },
      { date: "01.08.2023 14:42", percentage: "10%", description: "Registration bonus", amount: 5724.82 },
      { date: "01.08.2023 14:42", percentage: "10%", description: "Registration bonus", amount: 5724.82 }
    ],
    [
      { date: "31.07.2023 20:02", percentage: "10%", description: "Weekly Boost Reward", amount: 287.92 },
      { date: "30.07.2023 19:15", percentage: "12%", description: "Deposit Bonus", amount: 840.50 },
      { date: "28.07.2023 11:22", percentage: "8%", description: "Daily Cashback", amount: 150.30 },
      { date: "25.07.2023 18:10", percentage: "10%", description: "Rakeback Claim", amount: 412.00 },
      { date: "24.07.2023 16:40", percentage: "10%", description: "Registration bonus", amount: 5724.82 },
      { date: "23.07.2023 12:35", percentage: "15%", description: "Welcome Match Offer", amount: 500.00 }
    ],
    [
      { date: "20.07.2023 15:10", percentage: "5%", description: "Daily Rakeback", amount: 88.50 },
      { date: "18.07.2023 10:20", percentage: "10%", description: "Promo Wheel Prize", amount: 25.00 },
      { date: "15.07.2023 09:12", percentage: "15%", description: "Deposit Match Bonus", amount: 1250.00 }
    ]
  ];

  // 1. DYNAMIC VIP LEVEL COMPUTATION based on actual wagers
  const totalWagered = history.reduce((sum, item) => sum + item.betAmount, 0);

  // Define thresholds
  const vipThresholds = [
    { level: 0, required: 0, label: 'LVL 0' },
    { level: 1, required: 2500, label: 'LVL 1' },
    { level: 2, required: 10000, label: 'LVL 2' },
    { level: 3, required: 50000, label: 'LVL 3' },
    { level: 4, required: 150000, label: 'LVL 4' },
    { level: 5, required: 500000, label: 'LVL 5' }
  ];

  const getCurrentVipLevel = (wagered: number) => {
    let currentLevel = vipThresholds[0];
    let nextLevel = vipThresholds[1];

    for (let i = 0; i < vipThresholds.length; i++) {
      if (wagered >= vipThresholds[i].required) {
        currentLevel = vipThresholds[i];
        nextLevel = vipThresholds[i + 1] || vipThresholds[i];
      } else {
        break;
      }
    }
    return { currentLevel, nextLevel };
  };

  const { currentLevel, nextLevel } = getCurrentVipLevel(totalWagered);

  // Progress metrics
  const levelMin = currentLevel.required;
  const levelMax = nextLevel.required;
  const currentProgressVal = totalWagered - levelMin;
  const rangeNeeded = levelMax - levelMin;
  
  // Percent calculation
  const progressPercent = rangeNeeded > 0 
    ? Math.min((currentProgressVal / rangeNeeded) * 100, 100) 
    : 100;

  const wagerLeft = Math.max(levelMax - totalWagered, 0);

  // Format utility using dots as thousands separators to match the image precisely
  const formatVipNum = (val: number) => {
    return val.toLocaleString('en-US').replace(/,/g, '.');
  };

  const handleClaimWelcome = () => {
    if (hasClaimedWelcome) return;
    sound.playCashout();
    setHasClaimedWelcome(true);
    updateBalance(500, 'Welcome Match Bonus' as any, 1, 'win');
  };

  const spinDailyWheel = () => {
    if (hasSpunWheel || wheelSpinning) return;
    sound.playSpin();
    setWheelSpinning(true);

    const prizes = ['$25 Chips', 'No win', '$100 Bonus', '$50 Chips', '$500 Super VIP', '$10 Bonus', '$250 Gold Chips', 'No win'];
    const weights = [0.25, 0.05, 0.15, 0.20, 0.03, 0.20, 0.07, 0.05];
    
    let selectedIdx = 0;
    const r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (r <= cumulative) {
        selectedIdx = i;
        break;
      }
    }

    const sectorSize = 45;
    const sectorOffset = selectedIdx * sectorSize + sectorSize / 2;
    const fullSpinsDegree = 360 * 5;
    const finalDegree = fullSpinsDegree + (360 - sectorOffset);

    setWheelDegree(finalDegree);

    setTimeout(() => {
      sound.playWin();
      setWheelSpinning(false);
      setHasSpunWheel(true);
      
      const prizeString = prizes[selectedIdx];
      setWheelPrize(prizeString);

      const prizeMapping: Record<number, number> = {
        0: 25, 1: 0, 2: 100, 3: 50, 4: 500, 5: 10, 6: 250, 7: 0
      };
      const wonCash = prizeMapping[selectedIdx] || 0;
      if (wonCash > 0) {
        updateBalance(wonCash, 'Daily Fortune Wheel' as any, 1, 'win');
      }
    }, 4500);
  };

  const copyReferral = () => {
    sound.playClick();
    navigator.clipboard.writeText('https://vara567.bet/invite/user_fca4');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="promos_page_layout" className="flex flex-col h-full bg-[#0a0b0f] overflow-y-auto no-scrollbar pb-[65px] text-xs text-gray-300">
      
      {/* TABS SELECTOR AT TOP */}
      <div id="promos_tabs_nav" className="flex items-center justify-center border-b border-[#1b1d26] bg-[#0c0e14] px-4 py-2 sticky top-0 z-30 shadow-md">
        
        <div className="flex bg-[#13151c] p-0.5 rounded-xl border border-[#212431]">
          <button 
            onClick={() => { sound.playClick(); setActiveTab('vip'); }}
            className={`px-3 py-1.5 rounded-lg font-sans font-bold text-[10px] transition-all duration-200 ${
              activeTab === 'vip' 
                ? 'bg-gradient-to-b from-[#f2dfa7] to-[#caa753] text-[#0a0b0f] shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🏆 VIP Club
          </button>
          <button 
            onClick={() => { sound.playClick(); setActiveTab('wheel'); }}
            className={`px-3 py-1.5 rounded-lg font-sans font-bold text-[10px] transition-all duration-200 ${
              activeTab === 'wheel' 
                ? 'bg-gradient-to-b from-[#f2dfa7] to-[#caa753] text-[#0a0b0f] shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎡 Fortune Wheel
          </button>
          <button 
            onClick={() => { sound.playClick(); setActiveTab('referral'); }}
            className={`px-3 py-1.5 rounded-lg font-sans font-bold text-[10px] transition-all duration-200 ${
              activeTab === 'referral' 
                ? 'bg-gradient-to-b from-[#f2dfa7] to-[#caa753] text-[#0a0b0f] shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎁 Invites & Bonuses
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ==================== TAB 1: THE VIP CLUB ==================== */}
        {activeTab === 'vip' && (
          <motion.div
            key="vip_club_tab"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full"
          >
            {/* CUSHION & CROWN DISPLAY */}
            <div className="w-full bg-gradient-to-b from-[#111216] via-[#090a0d] to-[#0a0b0f] relative pt-6 pb-2 px-4 flex flex-col items-center justify-center overflow-hidden border-b border-[#12141a]">
              
              {/* Floating ambient decorations */}
              <div className="absolute top-10 left-[10%] opacity-20 pointer-events-none text-xl animate-bounce" style={{ animationDuration: '4s' }}>💎</div>
              <div className="absolute top-28 right-[12%] opacity-15 pointer-events-none text-lg animate-bounce" style={{ animationDuration: '6s' }}>💎</div>
              <div className="absolute top-12 right-[20%] text-amber-500/25 pointer-events-none text-xl transform -rotate-12">⚡</div>
              <div className="absolute top-32 left-[15%] text-orange-500/25 pointer-events-none text-xl transform rotate-12">⚡</div>

              {/* STUNNING GOLDEN CROWN ON RED SILK CUSHION SVG */}
              <div className="w-full max-w-[340px] aspect-[16/10] relative flex items-center justify-center drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] z-10">
                <img src={cupBonusImg} alt="Cup Bonus" className="w-full h-full object-contain p-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]" />
              </div>

            </div>

            {/* BENTO-STYLE 4 VIP CLUB REWARDS CARDS */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: EXCLUSIVE / BETKIN CLUB */}
              <div className="bg-[#0e0f12] border border-[#caa753]/25 hover:border-[#caa753]/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col shadow-lg">
                <div className="bg-gradient-to-r from-[#ffd97d] to-[#caa753] text-[#0e0c06] px-3.5 py-1.5 font-sans font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
                  <Trophy size={11} strokeWidth={2.5} />
                  <span>Exclusive</span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-sans font-black text-sm tracking-wide mb-1.5 italic uppercase">Betkin Club</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                      This is not just a VIP program. This is a club, this is a community that will only grow with cool chips and goodies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: LIMITLESS / WITHDRAWAL */}
              <div className="bg-[#0e0f12] border border-[#caa753]/25 hover:border-[#caa753]/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col shadow-lg">
                <div className="bg-gradient-to-r from-[#ffd97d] to-[#caa753] text-[#0e0c06] px-3.5 py-1.5 font-sans font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
                  <Flame size={11} strokeWidth={2.5} />
                  <span>Limitless</span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-sans font-black text-sm tracking-wide mb-1.5 italic uppercase">Withdrawal</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                      Same for everyone - unlimited. We do not want to limit users in withdrawing funds and we care about their comfort.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: VALUABLE / CASH BACK */}
              <div className="bg-[#0e0f12] border border-[#caa753]/25 hover:border-[#caa753]/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col shadow-lg">
                <div className="bg-gradient-to-r from-[#ffd97d] to-[#caa753] text-[#0e0c06] px-3.5 py-1.5 font-sans font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
                  <Star size={11} strokeWidth={2.5} />
                  <span>Valuable</span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-sans font-black text-sm tracking-wide mb-1.5 italic uppercase">Cash Back</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                      The best and coolest payouts in the industry, because we value our users so much!
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4: COLLABORATIVE / COMMUNITY */}
              <div className="bg-[#0e0f12] border border-[#caa753]/25 hover:border-[#caa753]/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col shadow-lg">
                <div className="bg-gradient-to-r from-[#ffd97d] to-[#caa753] text-[#0e0c06] px-3.5 py-1.5 font-sans font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare size={11} strokeWidth={2.5} />
                  <span>Collaborative</span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-sans font-black text-sm tracking-wide mb-1.5 italic uppercase">Community</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                      This is a unique opportunity to join the cool with popular influencers and celebrities.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* FULL VIP MATRIX / LEVEL BENEFITS TABLE */}
            <div className="p-4">
              <div className="bg-[#0c0e14] border border-[#1b1d26] rounded-2xl p-4">
                <h3 className="text-xs font-sans font-black text-white tracking-wider uppercase mb-3 flex items-center gap-2">
                  <Shield size={13} className="text-[#caa753]" />
                  <span>VIP Milestone Benefits Matrix</span>
                </h3>
                
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[#212431]/80 text-[10px] text-gray-500 uppercase font-mono">
                        <th className="py-2.5 px-3">Level</th>
                        <th className="py-2.5 px-3">Wager Required</th>
                        <th className="py-2.5 px-3">Daily Cashback</th>
                        <th className="py-2.5 px-3">Monthly Lottery</th>
                        <th className="py-2.5 px-3">Personal Manager</th>
                        <th className="py-2.5 px-3">Exclusive Promo</th>
                        <th className="py-2.5 px-3">Private TG/DS Chat</th>
                        <th className="py-2.5 px-3">Exclusive TG/DS Chat</th>
                        <th className="py-2.5 px-3">High End TG/DS Chat</th>
                        <th className="py-2.5 px-3">Exclusive Gift</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#181a24] text-[10.5px]">
                      <tr className={currentLevel.level === 0 ? 'bg-[#caa753]/10 font-bold text-white' : 'text-gray-400'}>
                        <td className="py-2.5 px-3 font-sans flex items-center gap-1">
                          <Shield size={11} className={currentLevel.level === 0 ? 'text-[#caa753]' : 'text-gray-500'} />
                          LVL 0 (Bronze)
                        </td>
                        <td className="py-2.5 px-3 font-mono">$0</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-400">1%</td>
                        <td className="py-2.5 px-3">1x Entry</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                      </tr>
                      <tr className={currentLevel.level === 1 ? 'bg-[#caa753]/10 font-bold text-white' : 'text-gray-400'}>
                        <td className="py-2.5 px-3 font-sans flex items-center gap-1">
                          <Shield size={11} className={currentLevel.level === 1 ? 'text-[#caa753]' : 'text-gray-500'} />
                          LVL 1 (Silver)
                        </td>
                        <td className="py-2.5 px-3 font-mono">$2.500</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-400">2%</td>
                        <td className="py-2.5 px-3">2x Entries</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                      </tr>
                      <tr className={currentLevel.level === 2 ? 'bg-[#caa753]/10 font-bold text-white' : 'text-gray-400'}>
                        <td className="py-2.5 px-3 font-sans flex items-center gap-1">
                          <Shield size={11} className={currentLevel.level === 2 ? 'text-[#caa753]' : 'text-gray-500'} />
                          LVL 2 (Gold)
                        </td>
                        <td className="py-2.5 px-3 font-mono">$10.000</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-400">4%</td>
                        <td className="py-2.5 px-3">3x Entries</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                      </tr>
                      <tr className={currentLevel.level === 3 ? 'bg-[#caa753]/10 font-bold text-white' : 'text-gray-400'}>
                        <td className="py-2.5 px-3 font-sans flex items-center gap-1">
                          <Shield size={11} className={currentLevel.level === 3 ? 'text-[#caa753]' : 'text-gray-500'} />
                          LVL 3 (Platinum)
                        </td>
                        <td className="py-2.5 px-3 font-mono">$50.000</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-400">6%</td>
                        <td className="py-2.5 px-3">5x Entries</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-rose-500">❌</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                      </tr>
                      <tr className={currentLevel.level === 4 ? 'bg-[#caa753]/10 font-bold text-white' : 'text-gray-400'}>
                        <td className="py-2.5 px-3 font-sans flex items-center gap-1">
                          <Shield size={11} className={currentLevel.level === 4 ? 'text-[#caa753]' : 'text-gray-500'} />
                          LVL 4 (Diamond)
                        </td>
                        <td className="py-2.5 px-3 font-mono">$150.000</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-400">8%</td>
                        <td className="py-2.5 px-3">8x Entries</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                      </tr>
                      <tr className={currentLevel.level === 5 ? 'bg-[#caa753]/10 font-bold text-white' : 'text-gray-400'}>
                        <td className="py-2.5 px-3 font-sans flex items-center gap-1">
                          <Shield size={11} className={currentLevel.level === 5 ? 'text-[#caa753]' : 'text-gray-500'} />
                          LVL 5 (Black Card)
                        </td>
                        <td className="py-2.5 px-3 font-mono">$500.000</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-400">10%</td>
                        <td className="py-2.5 px-3">12x Entries</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                        <td className="py-2.5 px-3 text-[#caa753]">✅</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* ==================== TAB 2: FORTUNE WHEEL ==================== */}
        {activeTab === 'wheel' && (
          <motion.div
            key="wheel_tab"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col p-4 md:p-6 gap-6 w-full max-w-7xl mx-auto text-gray-300"
          >
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: VIP TIER CAROUSEL (SILVER CARD) */}
              <div className="bg-[#111218] border border-[#1b1d24] rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden min-h-[300px] shadow-2xl">
                {/* Info icon top-left */}
                <div className="absolute top-4 left-4 text-gray-500 hover:text-white cursor-pointer transition">
                  <Info size={16} />
                </div>
                
                {/* SVG 3D shield carousel with arrows */}
                <div className="flex items-center justify-between w-full mt-4">
                  <button 
                    onClick={() => {
                      sound.playClick();
                      setSelectedTierIdx(prev => (prev > 0 ? prev - 1 : loyaltyTiers.length - 1));
                    }}
                    className="p-2 h-8 w-8 rounded-xl bg-[#181a24] hover:bg-[#212431] border border-[#2d313e] text-gray-400 hover:text-white flex items-center justify-center transition active:scale-90"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="relative flex flex-col items-center">
                    {/* SVG Shield with dynamic colors based on tier */}
                    <svg width="110" height="110" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] animate-pulse" style={{ animationDuration: '3s' }}>
                      <defs>
                        <linearGradient id="shieldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                          {selectedTierIdx === 0 && ( // Bronze
                            <>
                              <stop offset="0%" stopColor="#d5a6bd" />
                              <stop offset="50%" stopColor="#a64d79" />
                              <stop offset="100%" stopColor="#4c1130" />
                            </>
                          )}
                          {selectedTierIdx === 1 && ( // Silver
                            <>
                              <stop offset="0%" stopColor="#ffffff" />
                              <stop offset="25%" stopColor="#d1d5db" />
                              <stop offset="50%" stopColor="#9ca3af" />
                              <stop offset="75%" stopColor="#4b5563" />
                              <stop offset="100%" stopColor="#1f2937" />
                            </>
                          )}
                          {selectedTierIdx === 2 && ( // Gold
                            <>
                              <stop offset="0%" stopColor="#ffe066" />
                              <stop offset="40%" stopColor="#f59e0b" />
                              <stop offset="75%" stopColor="#d97706" />
                              <stop offset="100%" stopColor="#78350f" />
                            </>
                          )}
                          {selectedTierIdx === 3 && ( // Platinum
                            <>
                              <stop offset="0%" stopColor="#e2e8f0" />
                              <stop offset="35%" stopColor="#94a3b8" />
                              <stop offset="70%" stopColor="#475569" />
                              <stop offset="100%" stopColor="#0f172a" />
                            </>
                          )}
                        </linearGradient>
                        <linearGradient id="shieldFace" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#1e2029" />
                          <stop offset="100%" stopColor="#0a0b0e" />
                        </linearGradient>
                        <linearGradient id="chevronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          {selectedTierIdx === 0 && (
                            <>
                              <stop offset="0%" stopColor="#e6b8af" />
                              <stop offset="100%" stopColor="#a64d79" />
                            </>
                          )}
                          {selectedTierIdx === 1 && (
                            <>
                              <stop offset="0%" stopColor="#e5e7eb" />
                              <stop offset="100%" stopColor="#9ca3af" />
                            </>
                          )}
                          {selectedTierIdx === 2 && (
                            <>
                              <stop offset="0%" stopColor="#fef08a" />
                              <stop offset="100%" stopColor="#eab308" />
                            </>
                          )}
                          {selectedTierIdx === 3 && (
                            <>
                              <stop offset="0%" stopColor="#f1f5f9" />
                              <stop offset="100%" stopColor="#38bdf8" />
                            </>
                          )}
                        </linearGradient>
                      </defs>
                      <path d="M 60,10 L 102,30 L 102,70 L 60,110 L 18,70 L 18,30 Z" fill="url(#shieldRim)" stroke="#090a0d" strokeWidth="2.5" />
                      <path d="M 60,16 L 95,33 L 95,67 L 60,102 L 25,67 L 25,33 Z" fill="url(#shieldFace)" />
                      {/* Inner glowing core chevron pointing down */}
                      <path d="M 60,35 L 85,55 L 75,63 L 60,51 L 45,63 L 35,55 Z" fill="url(#chevronGrad)" stroke="#000" strokeWidth="0.5" />
                      <path d="M 60,54 L 75,67 L 68,73 L 60,66 L 52,73 L 45,67 Z" fill="url(#chevronGrad)" opacity="0.8" />
                    </svg>
                  </div>

                  <button 
                    onClick={() => {
                      sound.playClick();
                      setSelectedTierIdx(prev => (prev < loyaltyTiers.length - 1 ? prev + 1 : 0));
                    }}
                    className="p-2 h-8 w-8 rounded-xl bg-[#181a24] hover:bg-[#212431] border border-[#2d313e] text-gray-400 hover:text-white flex items-center justify-center transition active:scale-90"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Level Title */}
                <h4 className="text-white text-center font-sans font-black text-lg tracking-wider uppercase mt-3">
                  {loyaltyTiers[selectedTierIdx].name}
                </h4>

                {/* Badges indicators */}
                <div className="flex items-center justify-between px-2 mt-4 select-none">
                  <div className="px-2 py-0.5 rounded-md border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 font-sans font-bold text-[9px] uppercase tracking-wide flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {loyaltyTiers[selectedTierIdx].badgeCurrent}
                  </div>
                  <div className="px-2 py-0.5 rounded-md border border-orange-500/20 bg-orange-950/20 text-orange-400 font-sans font-bold text-[9px] uppercase tracking-wide flex items-center gap-1">
                    {loyaltyTiers[selectedTierIdx].badgeNext}
                  </div>
                </div>

                {/* Lime-green progress bar */}
                <div className="w-full bg-[#181a24] h-2.5 rounded-full mt-3.5 overflow-hidden p-[1.5px] border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-[#e3ff36] to-[#bfff00] rounded-full shadow-[0_0_8px_rgba(227,255,54,0.4)] transition-all duration-500"
                    style={{ width: `${loyaltyTiers[selectedTierIdx].progressPercent}%` }}
                  />
                </div>

                {/* Progress numbers */}
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono font-bold mt-1.5 px-1">
                  <span>{loyaltyTiers[selectedTierIdx].requiredMin}</span>
                  <span>{loyaltyTiers[selectedTierIdx].requiredMax}</span>
                </div>

                {/* Bottom yellow/dark action pill bar */}
                <div className="mt-5 flex items-center bg-[#13151d] border border-white/5 rounded-2xl p-1.5 justify-between gap-1">
                  <button 
                    onClick={() => sound.playClick()}
                    className="flex-1 text-left bg-gradient-to-b from-[#fef08a] to-[#fde047] text-black font-sans font-black text-[9.5px] py-2 px-3 rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 leading-none"
                  >
                    <span>Take the bonus</span>
                    <span className="bg-black/10 px-1 py-0.5 rounded flex items-center gap-0.5 text-black">
                      <span className="text-[8px]">₱</span>
                      <span>{loyaltyTiers[selectedTierIdx].bonus.toLocaleString()}</span>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      if (vipBonusClaimed) return;
                      sound.playCashout();
                      setVipBonusClaimed(true);
                      updateBalance(loyaltyTiers[selectedTierIdx].bonus, 'VIP Milestone Reward' as any, 1, 'win');
                      // Notification
                      const notif = document.createElement('div');
                      notif.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-5 py-3 rounded-full text-xs font-bold z-50 shadow-2xl animate-bounce flex items-center gap-2";
                      notif.innerHTML = `🏆 claimed ₱${loyaltyTiers[selectedTierIdx].bonus.toLocaleString()} VIP Bonus!`;
                      document.body.appendChild(notif);
                      setTimeout(() => document.body.removeChild(notif), 3000);
                    }}
                    disabled={vipBonusClaimed}
                    className={`px-3 py-2 rounded-xl text-white font-sans font-black text-[10px] uppercase tracking-wide leading-none transition-all duration-200
                      ${vipBonusClaimed 
                        ? 'bg-[#181a24] text-gray-600 border border-white/5 cursor-not-allowed' 
                        : 'bg-[#1e202c] hover:bg-gray-800 text-white border border-gray-700/80 active:scale-95'
                      }`}
                  >
                    {vipBonusClaimed ? '✓' : 'Claim'}
                  </button>
                </div>
              </div>

              {/* Card 2: AVAILABLE RAKEBACK (GOLD CARD) */}
              <div className="bg-gradient-to-tr from-[#251b0a] via-[#110d05] to-[#121319] border border-amber-500/15 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden min-h-[300px] shadow-2xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-sans font-black text-[11px] uppercase tracking-wider">Available rakeback</span>
                    <div className="text-gray-500 hover:text-white cursor-pointer transition">
                      <Info size={16} />
                    </div>
                  </div>

                  {/* High fidelity amount display */}
                  <h3 className="text-[#fbbf24] font-sans font-black text-2xl tracking-tight mt-3">
                    ₱{rakebackClaimed ? '0.00' : rakebackAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>

                  {/* Percentage badge */}
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#fbbf24] text-[9.5px] font-sans font-bold uppercase tracking-wide mt-2">
                    Current percentage: 4%
                  </span>
                </div>

                {/* Floating Coins SVG Group */}
                <div className="flex items-center justify-center my-3 select-none pointer-events-none opacity-90">
                  <svg width="120" height="75" viewBox="0 0 110 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                    <defs>
                      <linearGradient id="goldCoinRim" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffe066" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#b45309" />
                      </linearGradient>
                      <linearGradient id="goldCoinFace" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                    <g transform="translate(10, 30)">
                      <ellipse cx="20" cy="15" rx="18" ry="7" fill="url(#goldCoinRim)" />
                      <ellipse cx="20" cy="12" rx="18" ry="7" fill="url(#goldCoinFace)" stroke="#78350f" strokeWidth="0.5" />
                    </g>
                    <g transform="translate(55, 25)">
                      <ellipse cx="20" cy="15" rx="18" ry="7" fill="url(#goldCoinRim)" />
                      <ellipse cx="20" cy="12" rx="18" ry="7" fill="url(#goldCoinFace)" stroke="#78350f" strokeWidth="0.5" />
                    </g>
                    <g transform="translate(15, 10)">
                      <ellipse cx="25" cy="20" rx="22" ry="9" fill="url(#goldCoinRim)" />
                      <ellipse cx="25" cy="16" rx="22" ry="9" fill="url(#goldCoinFace)" stroke="#78350f" strokeWidth="0.5" />
                    </g>
                    <g transform="translate(15, 2)">
                      <ellipse cx="25" cy="20" rx="22" ry="9" fill="url(#goldCoinRim)" />
                      <ellipse cx="25" cy="16" rx="22" ry="9" fill="url(#goldCoinFace)" stroke="#78350f" strokeWidth="0.5" />
                      <circle cx="25" cy="16" r="5" fill="none" stroke="#78350f" strokeWidth="0.5" />
                    </g>
                    <g transform="translate(48, 12)">
                      <ellipse cx="25" cy="20" rx="22" ry="9" fill="url(#goldCoinRim)" />
                      <ellipse cx="25" cy="16" rx="22" ry="9" fill="url(#goldCoinFace)" stroke="#78350f" strokeWidth="0.5" />
                    </g>
                    <g transform="translate(48, 4)">
                      <ellipse cx="25" cy="20" rx="22" ry="9" fill="url(#goldCoinRim)" />
                      <ellipse cx="25" cy="16" rx="22" ry="9" fill="url(#goldCoinFace)" stroke="#78350f" strokeWidth="0.5" />
                      <circle cx="25" cy="16" r="5" fill="none" stroke="#78350f" strokeWidth="0.5" />
                    </g>
                  </svg>
                </div>

                {/* Claim trigger button */}
                <button
                  onClick={() => {
                    if (rakebackClaimed) return;
                    sound.playCashout();
                    setRakebackClaimed(true);
                    updateBalance(rakebackAmount, 'Available Rakeback' as any, 1, 'win');
                    // Notification
                    const notif = document.createElement('div');
                    notif.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-5 py-3 rounded-full text-xs font-bold z-50 shadow-2xl animate-bounce flex items-center gap-2";
                    notif.innerHTML = `🪙 Claimed ₱${rakebackAmount.toFixed(2)} Rakeback Bonus!`;
                    document.body.appendChild(notif);
                    setTimeout(() => document.body.removeChild(notif), 3000);
                  }}
                  disabled={rakebackClaimed}
                  className={`w-full py-3.5 rounded-2xl font-sans font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 leading-none shadow-lg
                    ${rakebackClaimed 
                      ? 'bg-[#14151a] text-gray-600 border border-white/5 cursor-not-allowed' 
                      : 'bg-[#181a20] hover:bg-[#20232e] text-white border border-[#2e313c]'
                    }`}
                >
                  {rakebackClaimed ? 'Claimed' : 'Claim'}
                </button>
              </div>

              {/* Card 3: WEEKLY REWARD (GREEN CARD) */}
              <div className="bg-gradient-to-tr from-[#0a1f11] via-[#040e08] to-[#121319] border border-green-500/15 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden min-h-[300px] shadow-2xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-[#22c55e] text-black font-sans font-black text-[9px] uppercase tracking-wider rounded-md">
                      Weekly
                    </span>
                    <div className="text-gray-500 hover:text-white cursor-pointer transition">
                      <Info size={16} />
                    </div>
                  </div>

                  {/* Green Boost Amount */}
                  <h3 className="text-[#22c55e] font-sans font-black text-2xl tracking-tight mt-4">
                    ₱{weeklyAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                  <h4 className="text-white font-sans font-black text-xs tracking-wider uppercase mt-0.5">
                    Boost
                  </h4>

                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[#22c55e] text-[9.5px] font-sans font-bold uppercase tracking-wide mt-2">
                    Current percentage: 5%
                  </span>
                </div>

                {/* Countdown Timer exactly matching screenshot */}
                <div className="my-4">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <span className="text-white font-mono font-black text-xl tracking-tight block bg-[#13151c]/60 py-1.5 rounded-xl border border-white/5">
                        {timeLeft.days.toString().padStart(2, '0')}
                      </span>
                      <span className="text-gray-500 font-sans font-extrabold text-[8.5px] tracking-widest block uppercase mt-1">Day</span>
                    </div>
                    <div>
                      <span className="text-white font-mono font-black text-xl tracking-tight block bg-[#13151c]/60 py-1.5 rounded-xl border border-white/5">
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </span>
                      <span className="text-gray-500 font-sans font-extrabold text-[8.5px] tracking-widest block uppercase mt-1">H</span>
                    </div>
                    <div>
                      <span className="text-white font-mono font-black text-xl tracking-tight block bg-[#13151c]/60 py-1.5 rounded-xl border border-white/5">
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </span>
                      <span className="text-gray-500 font-sans font-extrabold text-[8.5px] tracking-widest block uppercase mt-1">Min</span>
                    </div>
                    <div>
                      <span className="text-white font-mono font-black text-xl tracking-tight block bg-[#13151c]/60 py-1.5 rounded-xl border border-white/5">
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </span>
                      <span className="text-gray-500 font-sans font-extrabold text-[8.5px] tracking-widest block uppercase mt-1">Sec</span>
                    </div>
                  </div>
                </div>

                {/* Interactive locked Claim button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    // Notification of remaining time
                    const notif = document.createElement('div');
                    notif.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-[#1b1d24] text-white border border-green-500/30 px-5 py-3 rounded-full text-xs font-bold z-50 shadow-2xl animate-pulse";
                    notif.innerHTML = `🔒 Weekly Boost unlocks in ${timeLeft.days} days!`;
                    document.body.appendChild(notif);
                    setTimeout(() => document.body.removeChild(notif), 3000);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#0d2214] hover:bg-[#122e1b] text-[#22c55e] border border-green-500/20 font-sans font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 leading-none shadow-md"
                >
                  Weekly locked
                </button>
              </div>

              {/* Card 4: MONTHLY RELOAD (BLUE CARD) */}
              <div className="bg-gradient-to-tr from-[#0a1829] via-[#040a11] to-[#121319] border border-blue-500/15 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden min-h-[300px] shadow-2xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-[#3b82f6] text-white font-sans font-black text-[9px] uppercase tracking-wider rounded-md">
                      Monthly
                    </span>
                    <div className="text-gray-500 hover:text-white cursor-pointer transition">
                      <Info size={16} />
                    </div>
                  </div>

                  {/* Blue Reload Amount */}
                  <h3 className="text-[#3b82f6] font-sans font-black text-2xl tracking-tight mt-4">
                    ₱{monthlyAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                  <h4 className="text-white font-sans font-black text-xs tracking-wider uppercase mt-0.5">
                    Reload
                  </h4>

                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#3b82f6] text-[9.5px] font-sans font-bold uppercase tracking-wide mt-2">
                    Current percentage: 3%
                  </span>
                </div>

                {/* Countdown Timer exactly matching screenshot */}
                <div className="my-4">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <span className="text-white font-mono font-black text-xl tracking-tight block bg-[#13151c]/60 py-1.5 rounded-xl border border-white/5">
                        {timeLeft.days.toString().padStart(2, '0')}
                      </span>
                      <span className="text-gray-500 font-sans font-extrabold text-[8.5px] tracking-widest block uppercase mt-1">Day</span>
                    </div>
                    <div>
                      <span className="text-white font-mono font-black text-xl tracking-tight block bg-[#13151c]/60 py-1.5 rounded-xl border border-white/5">
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </span>
                      <span className="text-gray-500 font-sans font-extrabold text-[8.5px] tracking-widest block uppercase mt-1">H</span>
                    </div>
                    <div>
                      <span className="text-white font-mono font-black text-xl tracking-tight block bg-[#13151c]/60 py-1.5 rounded-xl border border-white/5">
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </span>
                      <span className="text-gray-500 font-sans font-extrabold text-[8.5px] tracking-widest block uppercase mt-1">Min</span>
                    </div>
                    <div>
                      <span className="text-white font-mono font-black text-xl tracking-tight block bg-[#13151c]/60 py-1.5 rounded-xl border border-white/5">
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </span>
                      <span className="text-gray-500 font-sans font-extrabold text-[8.5px] tracking-widest block uppercase mt-1">Sec</span>
                    </div>
                  </div>
                </div>

                {/* Interactive locked Claim button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    // Notification of remaining time
                    const notif = document.createElement('div');
                    notif.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-[#1b1d24] text-white border border-blue-500/30 px-5 py-3 rounded-full text-xs font-bold z-50 shadow-2xl animate-pulse";
                    notif.innerHTML = `🔒 Monthly Reload unlocks in ${timeLeft.days} days!`;
                    document.body.appendChild(notif);
                    setTimeout(() => document.body.removeChild(notif), 3000);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#0c1a2d] hover:bg-[#10243d] text-[#3b82f6] border border-blue-500/20 font-sans font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 leading-none shadow-md"
                >
                  Monthly locked
                </button>
              </div>

            </div>

            {/* History section exactly matching image */}
            <div className="flex flex-col gap-3 w-full mt-4">
              <h3 className="text-white font-sans font-black text-base tracking-wide">
                History
              </h3>

              {/* Rows List */}
              <div className="flex flex-col gap-2 w-full">
                {historyPages[historyPage].map((row, idx) => (
                  <div 
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#111218] hover:bg-[#151720] border border-[#1b1d24]/60 p-4 rounded-2xl transition-all duration-150 gap-3 sm:gap-4"
                  >
                    {/* Column 1: Date and time */}
                    <span className="text-gray-500 font-mono text-xs font-bold">
                      {row.date}
                    </span>

                    {/* Column 2: Percentage multiplier */}
                    <span className="text-white font-mono text-xs font-black min-w-[50px]">
                      {row.percentage}
                    </span>

                    {/* Column 3: Description */}
                    <span className="text-gray-400 font-sans text-xs font-bold flex-1">
                      {row.description}
                    </span>

                    {/* Column 4: Amount with blue coin/chip icon */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      {/* Blue Chip Circle Vector Icon with a 'P' exactly like the image */}
                      <div className="h-4.5 w-4.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border border-blue-300 flex items-center justify-center shadow-[0_0_6px_rgba(59,130,246,0.35)] select-none shrink-0 font-sans font-black text-white text-[8px]">
                        ₱
                      </div>
                      <span className="text-white font-mono text-xs font-black">
                        ₱{row.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginated Controller matching Previous/Next styling in the image */}
              <div className="flex justify-end gap-2.5 mt-3 select-none">
                <button
                  onClick={() => {
                    if (historyPage > 0) {
                      sound.playClick();
                      setHistoryPage(p => p - 1);
                    }
                  }}
                  disabled={historyPage === 0}
                  className={`px-5 py-2.5 rounded-xl font-sans font-black text-[10.5px] uppercase tracking-wide border transition duration-150 active:scale-95 leading-none
                    ${historyPage === 0 
                      ? 'bg-[#13151c]/40 text-gray-700 border-[#1a1d26] cursor-not-allowed' 
                      : 'bg-[#181a24] hover:bg-[#20232e] text-white border-[#2c2f3c]'
                    }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (historyPage < historyPages.length - 1) {
                      sound.playClick();
                      setHistoryPage(p => p + 1);
                    }
                  }}
                  disabled={historyPage === historyPages.length - 1}
                  className={`px-5 py-2.5 rounded-xl font-sans font-black text-[10.5px] uppercase tracking-wide border transition duration-150 active:scale-95 leading-none
                    ${historyPage === historyPages.length - 1 
                      ? 'bg-[#13151c]/40 text-gray-700 border-[#1a1d26] cursor-not-allowed' 
                      : 'bg-[#181a24] hover:bg-[#20232e] text-white border-[#2c2f3c]'
                    }`}
                >
                  Next
                </button>
              </div>
            </div>

          </motion.div>
        )}

        {/* ==================== TAB 3: BONUSES & INVITES ==================== */}
        {activeTab === 'referral' && (
          <motion.div
            key="referrals_tab"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col p-4 gap-4 w-full max-w-[600px] mx-auto"
          >
            {/* 100% Welcome Bonus */}
            <div className="bg-gradient-to-tr from-[#1b1914] to-[#0e0f13] border border-[#caa753]/30 rounded-2xl p-5 flex gap-4 relative overflow-hidden shadow-lg">
              <div className="absolute -left-12 -bottom-12 w-28 h-28 bg-[#caa753]/5 blur-xl rounded-full" />
              <div className="bg-gradient-to-b from-[#f2dfa7] to-[#caa753] text-[#0e0c06] h-11 w-11 shrink-0 rounded-xl flex items-center justify-center shadow-md">
                <Award size={22} className="stroke-[2.5]" />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#caa753] mb-0.5">Special Enrollment Promo</span>
                <h3 className="font-sans font-black text-white text-sm tracking-wide">100% WELCOME BONUS</h3>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  Unlock premium gaming credits and sign-on gold added to your wallet! Claiming this welcome match instantly awards $500.00 virtual cash chips.
                </p>
                
                <div className="mt-4 flex justify-between items-center gap-4">
                  <span className="text-[9px] font-mono text-gray-500">Expires: 2026-12-31</span>
                  <button
                    onClick={handleClaimWelcome}
                    disabled={hasClaimedWelcome}
                    className={`px-4.5 py-2 rounded-xl font-sans font-black uppercase text-[10px] tracking-wider transition-all duration-200
                      ${hasClaimedWelcome 
                        ? 'bg-[#181a24] text-gray-600 border border-[#212431] cursor-not-allowed'
                        : 'bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95 shadow-md'
                      }
                    `}
                  >
                    {hasClaimedWelcome ? 'CLAIMED ✓' : 'CLAIM NOW'}
                  </button>
                </div>
              </div>
            </div>

            {/* Affiliate Program details */}
            <div className="bg-[#0e0f12] border border-[#212431] rounded-2xl p-5 flex gap-3 flex-col shadow-lg">
              <div className="flex items-center gap-2 border-b border-[#212431] pb-3">
                <div className="bg-purple-500/10 p-1.5 rounded-lg border border-purple-500/20">
                  <Share2 size={15} className="text-purple-400 shrink-0" />
                </div>
                <h3 className="font-sans font-black text-white text-xs uppercase tracking-wide">AFFILIATE PROGRAM</h3>
              </div>
              <p className="text-[10.5px] text-gray-400 leading-relaxed font-sans">
                Refer friends and build your ultimate invite circle! Get 15% recurring commissions on all virtual sandbox house earnings accrued from your referred invite circle.
              </p>
              
              {/* Stats indicators */}
              <div className="grid grid-cols-3 gap-2.5 my-2.5 bg-[#13151c] border border-[#212431] p-3 rounded-xl text-center">
                <div>
                  <span className="text-[8px] text-gray-500 uppercase font-extrabold tracking-wider">Referrals</span>
                  <strong className="text-white block font-mono text-xs mt-0.5">14</strong>
                </div>
                <div>
                  <span className="text-[8px] text-gray-500 uppercase font-extrabold tracking-wider">Clicks</span>
                  <strong className="text-white block font-mono text-xs mt-0.5">142</strong>
                </div>
                <div>
                  <span className="text-[8px] text-gray-500 uppercase font-extrabold tracking-wider">Commission</span>
                  <strong className="text-emerald-400 block font-mono text-xs mt-0.5">$185.00</strong>
                </div>
              </div>

              {/* Copy link input helper */}
              <div className="mt-1">
                <span className="text-[9px] text-gray-500 uppercase font-extrabold tracking-wider block mb-1">Your Unique Invite Link</span>
                <div className="flex bg-[#13151c] border border-[#212431] p-1.5 rounded-xl items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-mono pl-1 px-1 flex-1 truncate">
                    https://vara567.bet/invite/user_fca4
                  </span>
                  <button
                    onClick={copyReferral}
                    className="bg-[#1c1e28] hover:bg-[#252835] text-gray-300 p-1.5 h-8 w-8 rounded-lg flex items-center justify-center transition shrink-0 border border-white/5"
                  >
                    {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Clipboard size={13} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
