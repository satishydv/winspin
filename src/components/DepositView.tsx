import React, { useState } from 'react';
import { ChevronLeft, Plus, CheckCircle, AlertCircle, Wallet, ArrowRight, CreditCard, HelpCircle, History } from 'lucide-react';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';

interface DepositViewProps {
  user: UserProfile;
  setView: (view: any) => void;
  updateBalance: (amount: number, gameType: string, multiplier: number, outcome: 'win' | 'loss') => void;
}

export default function DepositView({ user, setView, updateBalance }: DepositViewProps) {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const depositPresets = [100, 500, 1000, 2000, 5000, 10000];

  const recentDeposits = [
    { id: 1, amount: 100.00, method: 'UPI / Card', date: '07 May 2026, 09:23 PM', status: 'REJECTED', reason: 'not recv' },
    { id: 2, amount: 100.00, method: 'UPI / Card', date: '05 May 2026, 10:34 PM', status: 'REJECTED', reason: 'hhh' },
    { id: 3, amount: 500.00, method: 'UPI / Card', date: '04 May 2026, 09:53 PM', status: 'APPROVED', reason: '' },
    { id: 4, amount: 1000.00, method: 'NetBanking', date: '03 May 2026, 05:15 PM', status: 'APPROVED', reason: '' }
  ];

  const handleDeposit = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 100) {
      sound.playError();
      alert("Minimum deposit is ₹100");
      return;
    }
    
    sound.playClick();
    setIsSubmitting(true);
    setTimeout(() => {
      updateBalance(numAmount, "Deposit", 1, 'win');
      setAmount('');
      setIsSubmitting(false);
      sound.playSuccess();
      alert("Deposit successful!");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#0a0b0f] pb-[65px] relative no-scrollbar font-sans">
      
      {/* Top Header - Premium App Style */}
      <div className="sticky top-0 z-20 bg-[#0a0b0f]/80 backdrop-blur-xl border-b border-[#1c1e26] flex items-center justify-between p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              sound.playClick();
              setView('home');
            }}
            className="w-8 h-8 rounded-full bg-[#16181d] border border-[#222630] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1a1c24] transition-all active:scale-90"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-white font-black uppercase tracking-wider text-sm flex items-center gap-2">
            <Wallet size={16} className="text-[#eab308]" /> Wallet
          </h1>
        </div>
        
        <button className="text-gray-500 hover:text-white transition">
          <HelpCircle size={18} />
        </button>
      </div>

      <div className="p-4 sm:p-6 max-w-xl mx-auto w-full flex flex-col gap-5 relative z-0">
        
        {/* Real & Bonus Balance Blocks */}
        <div className="flex gap-3">
          <div className="flex-1 bg-[#12141a] rounded-2xl border border-[#1c1e26] p-4 text-center shadow-lg relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Real</p>
            <h2 className="text-white text-2xl font-black font-mono tracking-tighter drop-shadow-md">
              {user.balance.toFixed(2)}
            </h2>
          </div>
          
          <div className="flex-1 bg-[#12141a] rounded-2xl border border-[#1c1e26] p-4 text-center shadow-lg relative overflow-hidden group hover:border-orange-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Bonus</p>
            <h2 className="text-yellow-500 text-2xl font-black font-mono tracking-tighter drop-shadow-md">
              {(user.bonus !== undefined ? user.bonus : 0.00).toFixed(2)}
            </h2>
          </div>
        </div>

        {/* Toggle Tabs (Deposit/Withdraw) */}
        <div className="flex gap-3 mt-1">
          <div className="flex-1 py-3 text-center text-xs font-black text-[#1c1402] bg-gradient-to-r from-[#f2d075] to-[#d6a54a] rounded-xl shadow-[0_4px_15px_rgba(214,165,74,0.2)] uppercase tracking-wider cursor-default flex items-center justify-center gap-1.5">
            <span className="text-sm font-bold rotate-90 leading-none inline-block">↓</span> Deposit
          </div>
          <button 
            onClick={() => {
              sound.playClick();
              setView('withdraw');
            }}
            className="flex-1 py-3 text-center text-xs font-bold text-gray-400 bg-[#12141a] hover:bg-[#16181d] border border-[#1c1e26] rounded-xl uppercase tracking-wider cursor-pointer hover:text-white transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span className="text-sm font-bold -rotate-90 leading-none inline-block">↓</span> Withdraw
          </button>
        </div>

        {/* Amount Presets Grid */}
        <div className="bg-[#12141a] rounded-2xl border border-[#1c1e26] p-4 mt-1">
          <div className="grid grid-cols-3 gap-2">
            {depositPresets.map(preset => (
              <button
                key={preset}
                onClick={() => {
                  sound.playClick();
                  setAmount(preset.toString());
                }}
                className={`py-3 rounded-xl border text-sm font-black font-mono transition-all active:scale-95 flex items-center justify-center gap-1 ${
                  amount === preset.toString() 
                    ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]' 
                    : 'bg-[#0a0b0f] border-[#222630] text-gray-300 hover:border-[#3a4454] hover:text-white'
                }`}
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input & History Toggle */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 font-bold text-lg">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (min ₹100)"
              className="w-full bg-[#12141a] border border-[#1c1e26] rounded-xl pl-10 pr-4 py-3.5 text-white font-mono text-sm font-bold placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:bg-[#0a0b0f] focus:shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-all"
            />
          </div>
          
          <button 
            onClick={() => {
              sound.playClick();
              setShowHistory(!showHistory);
            }}
            className={`px-5 py-3.5 rounded-xl border font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              showHistory 
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' 
                : 'bg-[#12141a] border-[#1c1e26] text-gray-400 hover:text-white hover:bg-[#16181d]'
            }`}
          >
            <History size={14} /> History
          </button>
        </div>

        {/* Payment Methods Section (Visible when history is hidden) */}
        {!showHistory ? (
          <div className="mt-2 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-gray-400 font-black text-xs uppercase tracking-widest">
                Instant Pay
              </h3>
              <span className="bg-yellow-500 text-black text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded leading-none">
                Auto
              </span>
            </div>
            
            {/* Pay using UPI / Card Button */}
            <button 
              onClick={handleDeposit}
              disabled={isSubmitting || !amount}
              className={`w-full bg-[#12141a] border rounded-2xl p-4 text-left flex items-center justify-between transition-all group active:scale-[0.98] ${
                !amount || isSubmitting
                  ? 'border-[#1c1e26] opacity-70 cursor-not-allowed'
                  : 'border-[#222630] hover:border-yellow-500/50 cursor-pointer shadow-lg'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-10 rounded-xl flex items-center justify-center bg-white shadow-inner transition ${
                  !amount ? 'grayscale opacity-80' : ''
                }`}>
                  <span className="text-black font-black italic text-lg tracking-tighter">UPI</span>
                </div>
                <div>
                  <h4 className="text-white font-black text-sm mb-1 group-hover:text-yellow-400 transition-colors">Pay using UPI / Card</h4>
                  <p className="text-gray-500 text-[10px] font-bold tracking-wide">Cards, UPI, NetBanking, Wallets — instant credit</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="bg-yellow-500 text-black text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                  Instant
                </span>
                <ChevronLeft size={16} className="text-gray-600 group-hover:text-yellow-500 rotate-180 transition-colors" />
              </div>
            </button>
          </div>
        ) : (
          /* Recent Deposits History Section */
          <div className="mt-2 animate-fade-in pb-8">
            <div className="flex items-center gap-2 mb-4">
              <History size={16} className="text-yellow-500" />
              <h3 className="text-yellow-500 font-black text-xs uppercase tracking-widest">
                Recent Deposits
              </h3>
            </div>
            
            <div className="space-y-3">
              {recentDeposits.map(item => (
                <div key={item.id} className="bg-[#12141a] border border-[#1c1e26] rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-black font-mono text-base mb-1">₹{item.amount.toFixed(2)}</h4>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-gray-400">{item.method}</span> • {item.date}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-[9px] font-black tracking-wider px-2 py-1 rounded-md border uppercase ${
                        item.status === 'APPROVED' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  
                  {item.reason && (
                    <div className="bg-[#1a1315] rounded-lg p-2.5 flex items-start gap-2 border border-red-900/30">
                      <AlertCircle size={12} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-gray-400 text-[10px] font-medium leading-relaxed italic">{item.reason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button className="w-full text-yellow-500 hover:text-yellow-400 text-xs font-black uppercase tracking-widest mt-6 pb-4 transition text-center">
              View full history →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
