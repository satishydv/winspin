import React, { useState } from 'react';
import { ChevronLeft, Plus, CheckCircle, Clock, AlertCircle, Wallet, ArrowRight, Building2, Banknote, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';

interface WithdrawViewProps {
  user: UserProfile;
  setView: (view: any) => void;
  updateBalance: (amount: number, gameType: string, multiplier: number, outcome: 'win' | 'loss') => void;
}

export default function WithdrawView({ user, setView, updateBalance }: WithdrawViewProps) {
  const [amount, setAmount] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('bank1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const withdrawPresets = [100, 500, 1000, 2000, 5000];

  const banks = [
    {
      id: 'bank1',
      name: 'HDFC Bank',
      account: '****9182',
      holder: 'B chandrakanth',
      ifsc: 'HDFC0000742'
    }
  ];

  const recentWithdrawals = [
    { id: 1, amount: 100.00, bank: 'HDFC ****9182', date: '10 Jul 2026, 11:09 AM', status: 'REJECTED', reason: 'skjaDGLHJS,b' },
    { id: 2, amount: 100.00, bank: 'HDFC ****9182', date: '10 Jul 2026, 11:07 AM', status: 'REJECTED', reason: 'vbnbmc m' },
    { id: 3, amount: 100.00, bank: 'HDFC ****9182', date: '13 May 2026, 01:38 PM', status: 'REJECTED', reason: 'Chhvfdd' }
  ];

  const handleWithdraw = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 100) {
      sound.playError();
      alert("Minimum withdrawal is ₹100");
      return;
    }
    if (numAmount > user.balance) {
      sound.playError();
      alert("Insufficient funds");
      return;
    }
    
    sound.playClick();
    setIsSubmitting(true);
    setTimeout(() => {
      updateBalance(-numAmount, "Withdrawal", 1, 'loss');
      setAmount('');
      setIsSubmitting(false);
      sound.playSuccess();
      alert("Withdrawal request submitted successfully!");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#0a0b0f] pb-24 relative no-scrollbar font-sans">
      
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
            <Wallet size={16} className="text-[#eab308]" /> Funds Hub
          </h1>
        </div>
        
        <button className="text-gray-500 hover:text-white transition">
          <HelpCircle size={18} />
        </button>
      </div>

      <div className="p-4 sm:p-6 max-w-xl mx-auto w-full flex flex-col gap-6 relative z-0">
        
        {/* Toggle Tabs */}
        <div className="flex bg-[#12141a] rounded-xl p-1 border border-[#1c1e26]">
          <div className="flex-1 py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300 transition">
            Deposit
          </div>
          <div className="flex-1 py-2 text-center text-xs font-black text-[#1c1402] bg-gradient-to-r from-[#f2d075] to-[#d6a54a] rounded-lg shadow-sm uppercase tracking-wider cursor-default">
            Withdraw
          </div>
        </div>

        {/* Notice Info Box */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-start gap-3 shadow-inner">
          <AlertCircle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-yellow-200/80 text-[11px] leading-relaxed font-medium">
            Please ensure you have wagered your deposits completely before making a withdrawal request. Processing can take up to 24 hours.
          </p>
        </div>

        {/* Premium Balance Card */}
        <div className="bg-gradient-to-br from-[#16181e] to-[#0f1116] rounded-2xl border border-[#222630] p-6 text-center shadow-lg relative overflow-hidden group hover:border-[#303544] transition-colors">
          {/* Subtle gold glow behind balance */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/5 rounded-full blur-[40px] pointer-events-none" />
          
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Available Withdrawable</p>
          <div className="flex items-center justify-center gap-1.5 mb-2 relative z-10">
            <span className="text-[#eab308] font-bold text-xl mt-1">₹</span>
            <h2 className="text-white text-4xl font-black font-mono tracking-tighter drop-shadow-md">
              {user.balance.toFixed(2)}
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#000000]/40 border border-white/5 rounded-full px-3 py-1 relative z-10">
            <Wallet size={12} className="text-gray-500" />
            <p className="text-gray-500 text-[10px] font-mono font-bold tracking-widest uppercase">
              Total Wallet: <span className="line-through text-gray-600">₹{user.balance.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Withdraw Amount Section */}
        <div className="bg-[#12141a] rounded-2xl border border-[#1c1e26] p-5">
          <h3 className="text-white font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <Banknote size={16} className="text-yellow-500" /> Withdraw Amount
          </h3>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
            {withdrawPresets.map(preset => (
              <button
                key={preset}
                onClick={() => {
                  sound.playClick();
                  setAmount(preset.toString());
                }}
                className={`py-2.5 rounded-xl border text-xs font-black font-mono transition-all active:scale-95 flex items-center justify-center gap-1 ${
                  amount === preset.toString() 
                    ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]' 
                    : 'bg-[#181a20] border-[#222630] text-gray-400 hover:border-[#3a4454] hover:text-gray-200'
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>

          <div className="relative group">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 font-bold text-lg">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter custom amount"
              className="w-full bg-[#0a0b0f] border border-[#222630] rounded-xl pl-10 pr-16 py-4 text-white font-mono text-lg font-bold placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-all"
            />
            {amount && (
              <button 
                onClick={() => setAmount('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-[10px] font-bold uppercase px-2 py-1 bg-[#181a20] rounded hover:bg-[#222630] transition"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
               Min Limit: <span className="text-gray-300">₹100</span>
            </p>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
               Max Limit: <span className="text-gray-300">₹{user.balance.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Select Bank Account */}
        <div className="bg-[#12141a] rounded-2xl border border-[#1c1e26] p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-yellow-500" /> Receiving Bank
            </h3>
            <button 
              onClick={() => sound.playClick()}
              className="text-yellow-500 hover:text-yellow-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition"
            >
              <Plus size={12} strokeWidth={3} /> Add New
            </button>
          </div>
          
          <div className="space-y-2.5">
            {banks.map(bank => (
              <div 
                key={bank.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedBank(bank.id);
                }}
                className={`bg-[#0a0b0f] border rounded-xl p-4 cursor-pointer transition-all relative overflow-hidden group ${
                  selectedBank === bank.id 
                    ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.05)]' 
                    : 'border-[#222630] hover:border-[#3a4454]'
                }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selectedBank === bank.id ? 'border-yellow-500' : 'border-gray-600'
                  }`}>
                    {selectedBank === bank.id && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-gray-200 font-black text-sm">{bank.name}</h4>
                      <span className="text-gray-500 font-mono text-xs">{bank.account}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      <span>{bank.holder}</span>
                      <span>IFSC: {bank.ifsc}</span>
                    </div>
                  </div>
                </div>
                
                {selectedBank === bank.id && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Brass Golden Request Withdrawal Button */}
        <button 
          onClick={handleWithdraw}
          disabled={isSubmitting || !amount}
          className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 mt-2 ${
            !amount || isSubmitting
              ? 'bg-[#181a20] text-gray-600 cursor-not-allowed border border-[#222630]'
              : 'bg-gradient-to-b from-[#f2d075] to-[#d6a54a] text-[#1c1402] hover:brightness-110 shadow-[0_4px_20px_rgba(214,165,74,0.3)] border border-[#fce69a]/50'
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-[#1c1402] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Request Withdrawal <ArrowRight size={16} strokeWidth={3} />
            </>
          )}
        </button>

        {/* Recent Withdrawals */}
        <div className="mt-4 pb-8">
          <h3 className="text-gray-500 font-black text-xs uppercase tracking-widest mb-4">
            Recent Transactions
          </h3>
          
          <div className="space-y-3">
            {recentWithdrawals.map(item => (
              <div key={item.id} className="bg-[#12141a] border border-[#1c1e26] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-black font-mono text-base mb-1">₹{item.amount.toFixed(2)}</h4>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{item.date}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="bg-red-500/10 text-red-400 text-[9px] font-black tracking-wider px-2 py-1 rounded-md border border-red-500/20 uppercase">
                      {item.status}
                    </span>
                    <span className="text-gray-500 text-[10px] font-bold font-mono tracking-tight">{item.bank}</span>
                  </div>
                </div>
                
                {item.reason && (
                  <div className="bg-[#1a1315] rounded-lg p-2.5 flex items-start gap-2 border border-red-900/30">
                    <AlertCircle size={12} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-gray-400 text-[10px] font-medium leading-relaxed">Reason: <span className="text-gray-300">{item.reason}</span></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
