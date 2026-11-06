import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, ChevronRight, Share2, Award, Clipboard, Check, RefreshCw, Sparkles, DollarSign } from 'lucide-react';
import { sound } from '../utils/audio';

interface PromoOffersProps {
  balance: number;
  updateBalance: (amount: number, gameType: any, multiplier: number, outcome: any) => void;
  hasClaimedWelcome: boolean;
  setHasClaimedWelcome: (val: boolean) => void;
}

export default function PromoOffers({ balance, updateBalance, hasClaimedWelcome, setHasClaimedWelcome }: PromoOffersProps) {
  const [wheelSpinning, setWheelSpinning] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [hasSpunWheel, setHasSpunWheel] = useState<boolean>(false);
  const [wheelDegree, setWheelDegree] = useState<number>(0);
  const [wheelPrize, setWheelPrize] = useState<string>('');

  const handleClaimWelcome = () => {
    if (hasClaimedWelcome) return;
    sound.playCashout();
    setHasClaimedWelcome(true);
    // Double balance, up to extra $1,000! Let's award $500 free welcome chips
    updateBalance(500, 'Welcome Match Bonus' as any, 1, 'win');
  };

  const spinDailyWheel = () => {
    if (hasSpunWheel || wheelSpinning) return;
    sound.playSpin();
    setWheelSpinning(true);

    // Prizes matching index on wheel
    const prizes = ['$25 Chips', 'No win', '$100 Bonus', '$50 Chips', '$500 Super VIP', '$10 Bonus', '$250 Gold Chips', 'No win'];
    
    // Select prize random index (weighted towards small prizes)
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

    // degree calculation: 360 / 8 sectors = 45 deg per sector
    // we want core rotation + target offset
    const sectorSize = 45;
    const padding = 15; // stay away from lines
    const sectorOffset = selectedIdx * sectorSize + sectorSize / 2;
    const fullSpinsDegree = 360 * 5; // 5 full loops
    const finalDegree = fullSpinsDegree + (360 - sectorOffset); // target index aligned with arrow (top center)

    setWheelDegree(finalDegree);

    setTimeout(() => {
      // Finished spinning!
      sound.playWin();
      setWheelSpinning(false);
      setHasSpunWheel(true);
      
      const prizeString = prizes[selectedIdx];
      setWheelPrize(prizeString);

      // Award prize
      const prizeMapping: Record<number, number> = {
        0: 25,   // $25
        1: 0,    // no win
        2: 100,  // $100
        3: 50,   // $50
        4: 500,  // $500
        5: 10,   // $10
        6: 250,  // $250
        7: 0     // no win
      };
      const wonCash = prizeMapping[selectedIdx] || 0;
      if (wonCash > 0) {
        updateBalance(wonCash, 'Daily Fortune Wheel' as any, 1, 'win');
      }
    }, 4500); // 4.5 seconds rotation spin timing
  };

  const copyReferral = () => {
    sound.playClick();
    navigator.clipboard.writeText('https://winspin.bet/invite/user_fca4');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="promos_page_layout" className="flex flex-col h-full bg-dark-900 overflow-y-auto no-scrollbar pb-24 lg:pb-6 text-xs text-gray-300">
      
      {/* Promos Header Area */}
      <div id="promos_header" className="flex items-center justify-between px-4 py-3 border-b border-dark-700 bg-dark-950/80 backdrop-blur sticky top-0 z-10">
        <div id="promos_heading_unit" className="flex items-center gap-2">
          <Gift size={16} className="text-gold-accent animate-pulse" />
          <div>
            <h2 className="text-sm font-display font-bold text-white tracking-wide leading-none">REWARDS HUB</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Free Loot, Spins & Affiliates</p>
          </div>
        </div>
      </div>

      <div id="promos_cards_stack" className="flex flex-col p-4 gap-4">
        
        {/* Interactive WHEEL OF FORTUNE */}
        <div className="bg-dark-950/90 border border-gold-600/30 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-gold-500/10 border border-gold-500/20 text-gold-accent font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest font-display">
            Daily Spin
          </div>
          <h3 className="font-display font-black text-center text-white text-xs tracking-wider uppercase mb-1 flex items-center gap-1.5 justify-center">
            <Sparkles size={13} className="text-gold-accent" />
            WHEEL OF FORTUNE
          </h3>
          <p className="text-[10px] text-gray-400 text-center mb-4 max-w-[240px]">Test your fortune once every hour! Win up to $500 in gold chips instantly.</p>

          {/* The Spin Wheel Canvas Style Visual Circle */}
          <div className="relative w-40 h-40 aspect-square my-2 flex items-center justify-center">
            {/* Top Pin Arrow Pointer */}
            <div className="absolute -top-1 z-20 text-red-500 text-sm transform rotate-180 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] fill-current select-none pointer-events-none">
              ▼
            </div>

            <motion.div
              id="promo_fortune_wheel"
              style={{ rotate: wheelDegree }}
              transition={{ duration: 4.5, ease: 'easeOut' }}
              className="w-full h-full rounded-full border-4 border-gold-600 shadow-[0_0_20px_rgba(234,179,8,0.2)] bg-dark-850 relative overflow-hidden flex items-center justify-center select-none pointer-events-none"
            >
              {/* Radial Dividers & Emojis of 8 sectors */}
              {[...Array(8)].map((_, idx) => {
                const rotation = idx * 45;
                const prizesEmojis = ['💵 25', '🌪️ 0', '🪙 100', '💰 50', '👑 500', '💎 10', '✨ 250', '🌪️ 0'];

                return (
                  <div
                    key={idx}
                    className="absolute inset-0 flex origin-center items-start justify-center pt-3"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    {/* Line Splitter border for sectors */}
                    <div className="absolute top-0 bottom-1/2 left-1/2 w-[1px] bg-gold-600/30 origin-bottom" style={{ transform: 'translateX(-50%) rotate(22.5deg)' }} />
                    <span className="text-[9px] font-mono font-bold text-center text-gray-300 drop-shadow-md transform leading-tight select-none">
                      {prizesEmojis[idx]}
                    </span>
                  </div>
                );
              })}
              
              {/* Center golden pin caps */}
              <div className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 border border-gold-300 flex items-center justify-center shadow-lg z-10" />
            </motion.div>
          </div>

          {/* Prize Overlay feedback */}
          <AnimatePresence>
            {wheelPrize && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 text-center px-4 py-1.5 bg-gold-500/10 border border-gold-500/30 rounded-xl"
              >
                <p className="text-[10px] text-gray-400">Fortune prize matched:</p>
                <strong className="text-sm font-display font-black text-gold-accent">{wheelPrize}</strong>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger interactive spin button */}
          <button
            onClick={spinDailyWheel}
            disabled={wheelSpinning || hasSpunWheel}
            className={`w-full max-w-[180px] py-2.5 rounded-xl font-display font-black text-[10px] tracking-wider uppercase mt-4 transition duration-300 transform active:scale-95 flex items-center justify-center gap-1.5
              ${hasSpunWheel 
                ? 'bg-dark-800 text-gray-500 border border-dark-700 cursor-not-allowed' 
                : (wheelSpinning
                  ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30'
                  : 'bg-gold-500 hover:bg-gold-400 text-dark-950 font-black shadow-[0_3px_12px_rgba(234,179,8,0.25)] hover:shadow-[0_3px_15px_rgba(234,179,8,0.4)]'
                )
              }
            `}
          >
            <RefreshCw size={11} className={`${wheelSpinning ? 'animate-spin' : ''}`} />
            {hasSpunWheel ? 'SPUN TODAY' : (wheelSpinning ? 'SPINNING...' : 'SPIN FOR FREE')}
          </button>
        </div>

        {/* Banner Copy: WELCOME MATCH BONUS */}
        <div className="bg-gradient-to-tr from-gold-900/40 to-dark-950 border border-gold-600 rounded-2xl p-4 flex gap-3 relative overflow-hidden backdrop-blur">
          {/* Accent decoration */}
          <div className="absolute -left-12 -bottom-12 w-28 h-28 bg-gold-500/5 blur-xl rounded-full" />
          <div className="bg-gold-500/10 border border-gold-500/20 h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-gold-accent">
            <Award size={20} className="stroke-[2]" />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-semibold font-display text-gold-accent mb-0.5">Special Enrollment Promo</span>
            <h3 className="font-display font-black text-white text-xs tracking-wide">100% WELCOME BONUS</h3>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Deposit matches & instant sign-on gold added to wallet! Single-claim enrollment adds $500.00 virtual cash chips instantly.</p>
            
            <div className="mt-3.5 flex justify-between items-center gap-4">
              <span className="text-2xs font-mono text-gray-500">Expires: 2026-12-31</span>
              <button
                onClick={handleClaimWelcome}
                disabled={hasClaimedWelcome}
                className={`px-4 py-1.5 rounded-lg font-display font-black uppercase text-[10px] tracking-wider transition
                  ${hasClaimedWelcome 
                    ? 'bg-dark-800 text-gray-600 border border-dark-700 cursor-not-allowed'
                    : 'bg-gold-500 hover:bg-gold-400 text-dark-950 hover:shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                  }
                `}
              >
                {hasClaimedWelcome ? 'CLAIMED ✓' : 'CLAIM NOW'}
              </button>
            </div>
          </div>
        </div>

        {/* Affiliate Program details */}
        <div className="bg-dark-950/60 border border-dark-800 rounded-2xl p-4 flex gap-3 flex-col">
          <div className="flex items-center gap-2 border-b border-dark-800 pb-2">
            <Share2 size={15} className="text-purple-400 shrink-0" />
            <h3 className="font-display font-bold text-white text-xs uppercase tracking-wide">AFFILIATE PROGRAM</h3>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed">Winspin rewards you for invite referrals! Get 15% recurring commissions on all house earnings accrued from your referred invite circle.</p>
          
          {/* Simulated stats indicators */}
          <div className="grid grid-cols-3 gap-2.5 my-1 bg-dark-900 border border-dark-800 p-2.5 rounded-xl text-center">
            <div>
              <span className="text-[8px] text-gray-500 uppercase font-semibold">Referrals</span>
              <strong className="text-white block font-mono text-xs mt-0.5">14</strong>
            </div>
            <div>
              <span className="text-[8px] text-gray-500 uppercase font-semibold">Clicks</span>
              <strong className="text-white block font-mono text-xs mt-0.5">142</strong>
            </div>
            <div>
              <span className="text-[8px] text-gray-500 uppercase font-semibold">Commission</span>
              <strong className="text-emerald-400 block font-mono text-xs mt-0.5">$185.00</strong>
            </div>
          </div>

          {/* Copy link input helper */}
          <div className="mt-1">
            <span className="text-[9px] text-gray-500 uppercase font-semibold block mb-1">Your Unique Invite Link</span>
            <div className="flex bg-dark-900 border border-dark-800 p-1 rounded-xl items-center gap-1">
              <span className="text-[10px] text-gray-400 font-mono pl-1 px-1 flex-1 truncate">https://winspin.bet/invite/user_fca4</span>
              <button
                onClick={copyReferral}
                className="bg-dark-800 hover:bg-dark-700 text-gray-300 p-1.5 h-7 w-7 rounded-lg flex items-center justify-center transition shrink-0"
              >
                {copiedLink ? <Check size={12} className="text-emerald-400" /> : <Clipboard size={12} />}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
